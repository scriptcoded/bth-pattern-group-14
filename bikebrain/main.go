package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/scriptcoded/bth-pattern-group-14/bikebrain/cmd"
	"github.com/urfave/cli/v2"
)

// waitForInterrupt will wait untill it receives an interrupt from the OS.
func waitForInterrupt() {
	c := make(chan os.Signal)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	<-c
}

func main() {
	app := &cli.App{
		Name:  "bikebrain",
		Usage: "firmware for ELSP bikes",
		Commands: []*cli.Command{
			{
				Name:  "solo",
				Usage: "run a single bike",
				Flags: []cli.Flag{
					&cli.StringFlag{
						Name:    "id",
						Aliases: []string{"i"},
						Usage:   "bike ID",
					},
					&cli.StringFlag{
						Name:    "token",
						Aliases: []string{"t"},
						Usage:   "authorization token",
					},
					&cli.StringFlag{
						Name:    "endpoint",
						Aliases: []string{"e"},
						Value:   "http://localhost:4000",
						Usage:   "server endpoint",
					},
					&cli.BoolFlag{
						Name:    "verbose",
						Aliases: []string{"v"},
						Usage:   "enable verbose output",
					},
				},
				Action: func(c *cli.Context) error {
					id := c.String("id")
					token := c.String("token")
					endpoint := c.String("endpoint")
					verbose := c.Bool("verbose")

					if id == "" {
						return fmt.Errorf("id is required")
					}

					if token == "" {
						return fmt.Errorf("token is required")
					}

					if endpoint == "" {
						return fmt.Errorf("endpoint is required")
					}

					stopReport := cmd.Solo(
						verbose,
						endpoint,
						id,
						token,
						5*time.Second,
					)

					waitForInterrupt()

					log.Println("stopping report loop")

					close(stopReport)

					return nil
				},
			},
			{
				Name:  "simulate",
				Usage: "simlulate a number of bikes",
				Flags: []cli.Flag{
					&cli.IntFlag{
						Name:    "count",
						Aliases: []string{"c"},
						Value:   100,
						Usage:   "amount of bikes to simulate",
					},
					&cli.StringFlag{
						Name:    "endpoint",
						Aliases: []string{"e"},
						Value:   "http://localhost:4000",
						Usage:   "server endpoint",
					},
					&cli.BoolFlag{
						Name:    "verbose",
						Aliases: []string{"v"},
						Usage:   "enable verbose output",
					},
				},
				Action: func(c *cli.Context) error {
					count := c.Int("count")
					endpoint := c.String("endpoint")
					verbose := c.Bool("verbose")

					if count < 1 {
						return fmt.Errorf("count must be at least 1")
					}

					ids := make([]string, count)
					for i := 0; i < count; i++ {
						ids[i] = fmt.Sprintf("S%04d", i)
					}

					stopReport := cmd.Simulate(
						verbose,
						endpoint,
						ids,
						1*time.Second,
					)

					waitForInterrupt()

					log.Println("stopping report loop")

					close(stopReport)

					return nil
				},
			},
		},
	}

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}
