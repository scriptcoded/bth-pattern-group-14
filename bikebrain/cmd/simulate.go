package cmd

import (
	"fmt"
	"log"
	"math/rand"
	"strings"
	"time"

	"github.com/scriptcoded/bth-pattern-group-14/bikebrain/bike"
)

type Simulation struct {
	Bike *bike.Bike
}

func Simulate(
	verbose bool,
	endpoint string,
	ids []string,
	reportInterval time.Duration,
) chan struct{} {
	rand.Seed(time.Now().UnixNano())

	path := []bike.Point{
		{Latitude: "55.581415", Longitude: "12.941114"},
		{Latitude: "55.580754", Longitude: "12.940656"},
		{Latitude: "55.581338", Longitude: "12.937197"},
		{Latitude: "55.581410", Longitude: "12.937114"},
		{Latitude: "55.581562", Longitude: "12.937149"},
		{Latitude: "55.582652", Longitude: "12.937780"},
		{Latitude: "55.582822", Longitude: "12.936761"},
	}

	endpoint = strings.TrimRight(endpoint, "/")

	simulations := make([]*Simulation, len(ids))
	for i, id := range ids {
		simulations[i] = &Simulation{
			Bike: bike.New(id, fmt.Sprintf("%s/bikes/%s/status", endpoint, id)),
		}
		simulations[i].Bike.SetVerbose(verbose)
		go simulations[i].Bike.SimulatePath(path)
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
