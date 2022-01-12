package cmd

import (
	"fmt"
	"log"
	"math/rand"
	"strings"
	"time"

	"github.com/scriptcoded/bth-pattern-group-14/bikebrain/bike"
	"github.com/scriptcoded/bth-pattern-group-14/bikebrain/helpers"
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

type Simulation struct {
	Bike *bike.Bike
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
	ids []string,
	reportInterval time.Duration,
) chan struct{} {
	rand.Seed(time.Now().UnixNano())

	zones := []Zone{
		{
			BikeCount: 200,
			LatStart:  55.607457,
			LatEnd:    55.558648,
			LonStart:  12.975199,
			LonEnd:    13.055093,
		},
	}

	endpoint = strings.TrimRight(endpoint, "/")

	simulations := []*Simulation{}
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
			simulation := &Simulation{
				Bike: bike.New(id, fmt.Sprintf("%s/bikes/%s/status", endpoint, id)),
			}
			simulations = append(simulations, simulation)
			simulation.Bike.SetVerbose(verbose)
			go simulation.Bike.SimulatePath(path)
			counter++
		}
	}

	// Cancellable report loop
	ticker := time.NewTicker(reportInterval)
	stopReport := make(chan struct{})
	go func() {
		for {
			select {
			case <-ticker.C:
				for _, simulation := range simulations {
					err := simulation.Bike.Report()

					if err != nil {
						log.Fatalf("report error for bike %s: %v", simulation.Bike.Id, err)
					}
				}
			case <-stopReport:
				ticker.Stop()
				return
			}
		}
	}()

	return stopReport
}
