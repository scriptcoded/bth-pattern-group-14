package cmd

import (
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/scriptcoded/bth-pattern-group-14/bikebrain/bike"
)

// Solo is a demo solo bike. It will report its location to the server
// periodically, but it requires the location, speed and battery to be updated
// somehow. In a real life scenario this would be some form of hardware, but in
// this example it's left out. For a full simulation, check out `simulate`.
func Solo(
	verbose bool,
	endpoint string,
	id string,
	token string,
	reportInterval time.Duration,
) chan struct{} {
	endpoint = strings.TrimRight(endpoint, "/")
	endpointFull := fmt.Sprintf("%s/bikes/%s/status", endpoint, id)

	bike := bike.New(id, endpointFull)
	bike.SetVerbose(verbose)
	bike.SetToken(token)

	// Cancellable report loop
	ticker := time.NewTicker(reportInterval)
	stopReport := make(chan struct{})
	go func() {
		for {
			select {
			case <-ticker.C:
				err := bike.Report()

				if err != nil {
					log.Fatal("report error: ", err)
				}
			case <-stopReport:
				ticker.Stop()
				return
			}
		}
	}()

	return stopReport
}
