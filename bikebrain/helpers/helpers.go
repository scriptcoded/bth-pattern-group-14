package helpers

import (
	"fmt"
	"log"
	"math/rand"
	"strconv"
)

type Point struct {
	Latitude  string
	Longitude string
}

func RandFloat(min, max float64) float64 {
	return min + rand.Float64()*(max-min)
}

func ParsePoint(point Point) (float64, float64) {
	lat, err := strconv.ParseFloat(point.Latitude, 64)
	if err != nil {
		log.Fatalf("Error parsing last point latitude: %v", err)
	}
	lon, err := strconv.ParseFloat(point.Longitude, 64)
	if err != nil {
		log.Fatalf("Error parsing last point latitude: %v", err)
	}

	return lat, lon
}

func GeneratePath(center Point, steps int) []Point {
	lastLat, lastLon := ParsePoint(center)

	path := []Point{}

	for i := 0; i < steps; i++ {
		lat := RandFloat(lastLat-0.0020, lastLat+0.0020)
		lon := RandFloat(lastLon-0.0020, lastLon+0.0020)

		path = append(path, Point{
			Latitude:  fmt.Sprintf("%f", lat),
			Longitude: fmt.Sprintf("%f", lon),
		})

		lastLat, lastLon = ParsePoint(path[len(path)-1])
	}

	return path
}
