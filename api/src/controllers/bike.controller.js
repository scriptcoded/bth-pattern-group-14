/// <reference path="../polyfill.d.ts" />

const createError = require('http-errors')
const { checkSchema } = require('express-validator')

const { useAsync } = require('../utils/express')
const { auth } = require('../middleware/auth')
const { bikeAuth } = require('../middleware/bikeAuth')
const { validate } = require('../middleware/validate')
const { isPrismaError } = require('../utils/prisma')
const { generateBikeID } = require('../utils/bike')
const { findParkingZoneAtPoint } = require('../utils/zone')
const { generateToken } = require('../utils/crypto')

module.exports.getAllBikes = [

  useAsync(async (req, res) => {
    const bikes = await req.db.bike.findMany({
      where: {
        disabled: false,
        rides: {
          every: {
            endTime: {
              not: null
            }
          }
        }
      }
    })

    for (const bike of bikes) {
      delete bike.token
    }

    res.json({ data: bikes })
  })
]

module.exports.createBike = [
  auth('ADMIN'),

  checkSchema({
    latitude: {
      isDecimal: true,
      errorMessage: 'latitude must be a decimal'
    },
    longitude: {
      isDecimal: true,
      errorMessage: 'longitude must be a decimal'
    }
  }),

  validate(),

  useAsync(async (req, res) => {
    const token = await generateToken()

    // Try generating a unique ID and create bike 10 times. If it fails all 10
    // times, throw an error.
    let bike
    for (let i = 0; i < 10; i++) {
      const id = generateBikeID()

      try {
        bike = await req.db.bike.create({
          data: {
            id,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            token
          }
        })
        // If the creation succeeded, break the for loop
        break
      } catch (e) {
        // If the error is a "Unique constraint failed"-error, try again
        if (isPrismaError(e, 'P2002')) {
          continue
        }

        throw e
      }
    }

    if (!bike) {
      throw createError(409, 'Failed generating unique ID, please try again')
    }

    res.json({ data: bike })
  })
]

module.exports.deleteBike = [
  auth('ADMIN'),

  useAsync(async (req, res) => {
    try {
      const bike = await req.db.bike.delete({
        where: {
          id: req.params.id
        }
      })

      delete bike.token

      res.json({ data: bike })
    } catch (e) {
      if (isPrismaError(e, 'P2025')) {
        throw createError(404, 'Bike not found')
      }

      throw e
    }
  })
]

module.exports.getOneBike = [
  auth('ADMIN'),

  useAsync(async (req, res) => {
    const bike = await req.db.bike.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!bike) {
      throw createError(404, 'User not found')
    }

    delete bike.token

    res.json({ data: bike })
  })
]

module.exports.updateBike = [
  auth('ADMIN'),

  checkSchema({
    disabled: {
      optional: true,
      isBoolean: true,
      errorMessage: 'disabled must be a boolean'
    }
  }),

  validate(),

  useAsync(async (req, res) => {
    try {
      const bike = await req.db.bike.update({
        where: {
          id: req.params.id
        },
        data: req.body
      })

      delete bike.token

      res.json({ data: bike })
    } catch (e) {
      if (isPrismaError(e, 'P2025')) {
        throw createError(404, 'Bike not found')
      }

      throw e
    }
  })
]

module.exports.startRide = [
  auth(),

  useAsync(async (req, res) => {
    // Make sure that there is not already a ride in progress
    const activeRide = await req.db.ride.findFirst({
      where: {
        bikeId: req.params.id,
        endTime: null
      }
    })

    if (activeRide) {
      throw createError(409, 'Bike is already in use')
    }

    const bike = await req.db.bike.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!bike) {
      throw createError(404, 'Bike not found')
    }

    const parkingZone = await findParkingZoneAtPoint(req.db, bike.latitude, bike.longitude)

    // Create a new ride
    const ride = await req.db.ride.create({
      data: {
        bike: { connect: { id: bike.id } },
        user: { connect: { id: req.user.id } },
        startTime: new Date(),
        fromParkingZone: !!parkingZone,
        startLatitude: bike.latitude,
        startLongitude: bike.longitude
      }
    })

    res.send({ data: ride })
  })
]

module.exports.endRide = [
  auth(),

  useAsync(async (req, res) => {
    // Make sure that there is not already a ride in progress
    const activeRide = await req.db.ride.findFirst({
      where: {
        bikeId: req.params.id,
        endTime: null
      },
      include: {
        bike: true
      }
    })

    if (!activeRide) {
      throw createError(409, 'Bike is not in use')
    }

    const bike = activeRide.bike

    const parkingZone = await findParkingZoneAtPoint(req.db, bike.latitude, bike.longitude)

    // Update active ride
    const ride = await req.db.ride.update({
      where: {
        id: activeRide.id
      },
      data: {
        endTime: new Date(),
        toParkingZone: !!parkingZone,
        endLatitude: bike.latitude,
        endLongitude: bike.longitude
      }
    })

    res.send({ data: ride })
  })
]

module.exports.updateStatus = [
  bikeAuth(),

  checkSchema({
    latitude: {
      isDecimal: true,
      optional: true,
      errorMessage: 'latitude must be a decimal'
    },
    longitude: {
      isDecimal: true,
      optional: true,
      errorMessage: 'longitude must be a decimal'
    },
    battery: {
      isInt: {
        options: {
          min: 0,
          max: 100
        }
      },
      optional: true,
      errorMessage: 'battery must be an integer between 0-100'
    },
    speed: {
      isDecimal: true,
      optional: true,
      errorMessage: 'speed must be a decimal'
    }
  }),

  useAsync(async (req, res) => {
    const bike = await req.db.bike.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!bike) {
      throw createError(404, 'Bike not found')
    }

    // Update bike
    const updatedBike = await req.db.bike.update({
      where: {
        id: bike.id
      },
      data: {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        battery: req.body.battery,
        speed: req.body.speed
      }
    })

    delete bike.token

    res.send({ data: updatedBike })
  })
]
