package bike

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"strconv"
	"time"

	"github.com/scriptcoded/bth-pattern-group-14/bikebrain/helpers"
)

type Bike struct {
	Id        string
	Latitude  string
	Longitude string

	Battery   int
	Speed     float32
	Disabled  bool
	Locked    bool
	Available bool

	ReportEndpoint string

	Verbose bool
	// SimulationPrecision specifies how often the bike should update it's
	// simulated position in traveled meters.
	SimulationPrecision        float64
	DistanceSinceLastDecharge  float64
	MetersPerBatteryPercentage float64

	token string
}

type ReportPayload struct {
	Latitude  string  `json:"latitude"`
	Longitude string  `json:"longitude"`
	Battery   int     `json:"battery"`
	Speed     float32 `json:"speed"`
}

type ReportResponse struct {
	Data struct {
		ID        string  `json:"id"`
		CreatedAt string  `json:"createdAt"`
		UpdatedAt string  `json:"updatedAt"`
		Token     string  `json:"token"`
		Latitude  string  `json:"latitude"`
		Longitude string  `json:"longitude"`
		Battery   int     `json:"battery"`
		Speed     float32 `json:"speed"`
		Disabled  bool    `json:"disabled"`
		Available bool    `json:"available"`
	} `json:"data"`
}

func New(id string, reportEndpoint string) *Bike {
	return &Bike{
		Id:                         id,
		Latitude:                   "0.000000", // Null island
		Longitude:                  "0.000000",
		Battery:                    100,
		Speed:                      0,
		Disabled:                   false,
		ReportEndpoint:             reportEndpoint,
		Verbose:                    false,
		SimulationPrecision:        5,
		DistanceSinceLastDecharge:  0,
		MetersPerBatteryPercentage: 25,

		token: "",
	}
}

func (b *Bike) SetVerbose(verbose bool) {
	b.Verbose = verbose
}

func (b *Bike) SetToken(token string) {
	b.token = token
}

// SetPosition sets the bike's latitude and longitude to the given values.
// Should be used by the harware interface.
func (b *Bike) SetPosition(point helpers.Point) {
	// Don't update the position unless the bike is actually in use
	if b.Available {
		return
	}

	// Don't move if the battery is dead
	if b.Battery <= 0 {
		return
	}

	fromLat, fromLon := helpers.ParsePoint(helpers.Point{
		Latitude:  b.Latitude,
		Longitude: b.Longitude,
	})
	toLat, toLon := helpers.ParsePoint(point)

	distance := HaversinDistance(fromLat, fromLon, toLat, toLon)

	b.DistanceSinceLastDecharge += distance

	if b.DistanceSinceLastDecharge >= b.MetersPerBatteryPercentage {
		b.DistanceSinceLastDecharge = 0
		b.Battery -= 1
	}

	b.Latitude = point.Latitude
	b.Longitude = point.Longitude
}

// SetSpeed sets the bike's speed to the given value. Should be used by the
// harware interface.
func (b *Bike) SetSpeed(speed float32) {
	b.Speed = speed
}

// SetBattery sets the bike's battery to the given value. Should be used by the
// harware interface.
func (b *Bike) SetBattery(battery int) {
	b.Battery = battery
}

func (b *Bike) Report() error {
	payload := ReportPayload{
		Latitude:  b.Latitude,
		Longitude: b.Longitude,
		Battery:   b.Battery,
		Speed:     b.Speed,
	}

	payloadJSON, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	client := &http.Client{}

	if b.Verbose {
		log.Printf(`Updating bike
	ID: %s
	Latitude: %s
	Longitude: %s
	Battery: %d
	Speed: %f
`, b.Id, b.Latitude, b.Longitude, b.Battery, b.Speed)
	}

	req, err := http.NewRequest("POST", b.ReportEndpoint, bytes.NewBuffer(payloadJSON))
	if err != nil {
		return err
	}

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", b.token))

	resp, err := client.Do(req)
	if err != nil {
		return err
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	var responseJSON ReportResponse
	err = json.Unmarshal(body, &responseJSON)
	if err != nil {
		return err
	}

	b.Disabled = responseJSON.Data.Disabled
	b.Available = responseJSON.Data.Available

	return nil
}

func (b *Bike) SimulateInfinitePath(latStart float64, latEnd float64, lonStart float64, lonEnd float64) {
	lat := helpers.RandFloat(latStart, latEnd)
	lon := helpers.RandFloat(lonStart, lonEnd)
	startPoint := helpers.Point{
		Latitude:  fmt.Sprintf("%f", lat),
		Longitude: fmt.Sprintf("%f", lon),
	}

	for {
		path := helpers.GeneratePath(startPoint, 20)
		startPoint = path[len(path)-1]
		b.SimulatePath(path)
	}
}

func (b *Bike) SimulatePath(points []helpers.Point) {
	// Random speed between 10 and 20 km/h
	speed := helpers.RandFloat(10, 20)

	b.SetSpeed(float32(speed))

	for i, point := range points {
		var lastPoint helpers.Point
		if i > 0 {
			lastPoint = points[i-1]
		} else {
			// If this is the first point in the list, move from the current position
			lastPoint = helpers.Point{
				Latitude:  b.Latitude,
				Longitude: b.Longitude,
			}
		}

		b.SetPosition(point)

		lastPointLat, err := strconv.ParseFloat(lastPoint.Latitude, 64)
		if err != nil {
			log.Printf("Error parsing last point latitude: %v", err)
			continue
		}
		lastPointLon, err := strconv.ParseFloat(lastPoint.Longitude, 64)
		if err != nil {
			log.Printf("Error parsing last point longitude: %v", err)
			continue
		}
		currPointLat, err := strconv.ParseFloat(point.Latitude, 64)
		if err != nil {
			log.Printf("Error parsing current point latitude: %v", err)
			continue
		}
		currPointLon, err := strconv.ParseFloat(point.Longitude, 64)
		if err != nil {
			log.Printf("Error parsing current point longitude: %v", err)
			continue
		}

		distance := HaversinDistance(
			lastPointLat,
			lastPointLon,
			currPointLat,
			currPointLon,
		)

		// Calculate the time in seconds it takes to travel the distance
		travelTime := (distance / 1000) / (speed / (60 * 60))

		updateCount := math.Floor(distance / b.SimulationPrecision)
		updateInterval := travelTime / updateCount

		if b.Verbose {
			log.Printf("Going to %s, %s over %fs\n", point.Latitude, point.Longitude, travelTime)
		}

		// Don't simulate smooth movement if the bike is too close or far away from
		// the next point.
		if updateCount > 1 && updateCount < 1000 {
			deltaLat := currPointLat - lastPointLat
			deltaLon := currPointLon - lastPointLon

			for j := 0; j < int(updateCount); j++ {
				time.Sleep(time.Duration(updateInterval) * time.Second)

				progress := float64(j) / float64(updateCount)

				lerpLat := deltaLat*progress + lastPointLat
				lerpLon := deltaLon*progress + lastPointLon

				b.SetPosition(helpers.Point{
					Latitude:  fmt.Sprintf("%f", lerpLat),
					Longitude: fmt.Sprintf("%f", lerpLon),
				})
			}
		}

	}
}
