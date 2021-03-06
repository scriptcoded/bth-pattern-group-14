/// <reference path="../polyfill.d.ts" />

const createError = require('http-errors')

const { useAsync } = require('../utils/express')

module.exports.getAllBikes = [
  useAsync(async (req, res) => {
    let bikes = await req.db.bike.findMany()

    bikes = bikes.map(bike => {
      delete bike.token
      return bike
    })

    res.json({ data: bikes })
  })
]

module.exports.getOneBike = [
  useAsync(async (req, res) => {
    const bike = await req.db.bike.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!bike) {
      throw createError(404, 'Bike not found')
    }

    delete bike.token

    res.json({ data: bike })
  })
]

module.exports.getAllChargingStations = [
  useAsync(async (req, res) => {
    const stations = await req.db.chargingStation.findMany()
    res.json({ data: stations })
  })
]

module.exports.getOneChargingStation = [
  useAsync(async (req, res) => {
    const station = await req.db.chargingStation.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!station) {
      throw createError(404, 'Charging station not found')
    }

    res.json({ data: station })
  })
]

module.exports.getAllParkingZones = [
  useAsync(async (req, res) => {
    const zones = await req.db.parkingZone.findMany()
    res.json({ data: zones })
  })
]

module.exports.getOneParkingZone = [
  useAsync(async (req, res) => {
    const parkingzone = await req.db.parkingZone.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!parkingzone) {
      throw createError(404, 'Parking zone not found')
    }

    res.json({ data: parkingzone })
  })
]

module.exports.getAllDrivingZones = [
  useAsync(async (req, res) => {
    const zones = await req.db.drivingZone.findMany()
    res.json({ data: zones })
  })
]

module.exports.getOneDrivingZone = [
  useAsync(async (req, res) => {
    const drivingzone = await req.db.drivingZone.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!drivingzone) {
      throw createError(404, 'Driving zone not found')
    }

    res.json({ data: drivingzone })
  })
]
