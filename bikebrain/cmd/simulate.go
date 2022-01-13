package cmd

import (
	"fmt"
	"log"
	"math/rand"
	"strings"
	"time"

	"github.com/scriptcoded/bth-pattern-group-14/bikebrain/bike"
	"github.com/scriptcoded/bth-pattern-group-14/bikebrain/helpers"
	"github.com/scriptcoded/bth-pattern-group-14/bikebrain/user"
)

func generatePath(center bike.Point, steps int) []bike.Point {
	lastLat, lastLon := helpers.ParsePoint(center)

	path := []bike.Point{}

	for i := 0; i < steps; i++ {
		lat := helpers.RandFloat(lastLat-0.0020, lastLat+0.0020)
		lon := helpers.RandFloat(lastLon-0.0020, lastLon+0.0020)

		path = append(path, bike.Point{
			Latitude:  fmt.Sprintf("%f", lat),
			Longitude: fmt.Sprintf("%f", lon),
		})

		lastLat, lastLon = helpers.ParsePoint(path[len(path)-1])
	}

	return path
}

type Zone struct {
	BikeCount int
	LatStart  float64
	LatEnd    float64
	LonStart  float64
	LonEnd    float64
}

func Simulate(
	verbose bool,
	endpoint string,
	userIds []string,
	reportInterval time.Duration,
) chan struct{} {
	rand.Seed(time.Now().UnixNano())

	zones := []Zone{
		{
			BikeCount: 200,
			LatStart:  55.558648,
			LatEnd:    55.607457,
			LonStart:  12.975199,
			LonEnd:    13.055093,
		},
		{
			BikeCount: 200,
			LatStart:  55.692376,
			LatEnd:    55.730383,
			LonStart:  13.156146,
			LonEnd:    13.234241,
		},
		{
			BikeCount: 200,
			LatStart:  56.194692,
			LatEnd:    56.223860,
			LonStart:  15.612477,
			LonEnd:    15.661401,
		},
		{
			BikeCount: 400,
			LatStart:  59.218775,
			LatEnd:    59.490462,
			LonStart:  17.818657,
			LonEnd:    18.228153,
		},
		{
			BikeCount: 50,
			LatStart:  55.902818,
			LatEnd:    55.916021,
			LonStart:  12.684624,
			LonEnd:    12.711622,
		},
	}

	endpoint = strings.TrimRight(endpoint, "/")

	bikes := []*bike.Bike{}
	counter := 0
	for zone := range zones {
		for i := 0; i < zones[zone].BikeCount; i++ {
			id := fmt.Sprintf("S%04d", counter)
			lat := helpers.RandFloat(zones[zone].LatStart, zones[zone].LatEnd)
			lon := helpers.RandFloat(zones[zone].LonStart, zones[zone].LonEnd)
			point := bike.Point{
				Latitude:  fmt.Sprintf("%f", lat),
				Longitude: fmt.Sprintf("%f", lon),
			}

			path := generatePath(point, 5)
			simBike := bike.New(id, fmt.Sprintf("%s/bikes/%s/status", endpoint, id))
			bikes = append(bikes, simBike)
			simBike.SetVerbose(verbose)
			go simBike.SimulatePath(path)
			counter++
		}
	}

	reportBikes := func() {
		for _, simBike := range bikes {
			err := simBike.Report()

			if err != nil {
				log.Fatalf("report error for bike %s: %v", simBike.Id, err)
			}
		}
	}

	// Cancellable report loop
	ticker := time.NewTicker(reportInterval)
	stopReport := make(chan struct{})
	go func() {
		for {
			select {
			case <-ticker.C:
				reportBikes()
			case <-stopReport:
				ticker.Stop()
				return
			}
		}
	}()

	log.Println("Doing initial report")
	reportBikes()
	log.Println("Initial report done")

	getRandomBike := func() *bike.Bike {
		availableBikes := []*bike.Bike{}

		for _, bike := range bikes {
			if bike.Available {
				availableBikes = append(availableBikes, bike)
			}
		}

		if len(availableBikes) <= 0 {
			return nil
		}

		return availableBikes[rand.Intn(len(availableBikes))]
	}

	users := []*user.User{}
	for _, id := range userIds {
		user := user.New(id, endpoint)
		user.SetRandomBikeFunc(getRandomBike)

		err := user.Login()
		if err != nil {
			log.Fatalf("Error logging in user %s: %s", id, err)
		}

		users = append(users, user)
		go user.Simulate()
	}

	return stopReport
}
