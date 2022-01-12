package helpers

import (
	"log"
	"math/rand"
	"strconv"

	"github.com/scriptcoded/bth-pattern-group-14/bikebrain/bike"
)

func RandFloat(min, max float64) float64 {
	return min + rand.Float64()*(max-min)
}

func ParsePoint(point bike.Point) (float64, float64) {
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
