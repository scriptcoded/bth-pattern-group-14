/// <reference path="../polyfill.d.ts" />

const createError = require('http-errors')
const { checkSchema } = require('express-validator')

const { useAsync } = require('../utils/express')
const { auth } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const { isPrismaError } = require('../utils/prisma')

module.exports.getAllParkingZones = [
  auth('ADMIN'),

  useAsync(async (req, res) => {
    const zones = await req.db.parkingZone.findMany()
    res.json({ data: zones })
  })
]

module.exports.createParkingZone = [
  auth('ADMIN'),

  checkSchema({
    latitudeStart: {
      isDecimal: true,
      errorMessage: 'Latitude start must be a decimal'
    },
    longitudeStart: {
      isDecimal: true,
      errorMessage: 'Longitude start must be a decimal'
    },
    latitudeEnd: {
      isDecimal: true,
      errorMessage: 'Latitude end must be a decimal'
    },
    longitudeEnd: {
      isDecimal: true,
      errorMessage: 'Longitude end must be a decimal'
    }
  }),

  validate(),

  useAsync(async (req, res) => {
    const parkingZone = await req.db.parkingZone.create({
      data: {
        latitudeStart: req.body.latitudeStart,
        longitudeStart: req.body.longitudeStart,
        latitudeEnd: req.body.latitudeEnd,
        longitudeEnd: req.body.longitudeEnd
      }
    })
    res.json({ data: parkingZone })
  })
]

module.exports.deleteParkingZone = [
  auth('ADMIN'),

  useAsync(async (req, res) => {
    try {
      const parkingZone = await req.db.parkingZone.delete({
        where: {
          id: req.params.id
        }
      })

      res.json({ data: parkingZone })
    } catch (e) {
      if (isPrismaError(e, 'P2025')) {
        throw createError(404, 'Parking zone not found')
      }

      throw e
    }
  })
]

module.exports.getOneParkingZone = [
  auth('ADMIN'),

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

module.exports.updateParkingStation = [
  auth('ADMIN'),

  checkSchema({
    latitudeStart: {
      optional: true,
      isDecimal: true,
      errorMessage: 'Latitude start must be a decimal'
    },
    longitudeStart: {
      optional: true,
      isDecimal: true,
      errorMessage: 'Longitude start must be a decimal'
    },
    latitudeEnd: {
      optional: true,
      isDecimal: true,
      errorMessage: 'Latitude end must be a decimal'
    },
    longitudeEnd: {
      optional: true,
      isDecimal: true,
      errorMessage: 'Longitude end must be a decimal'
    }
  }),

  validate(),

  useAsync(async (req, res) => {
    try {
      const parkingZone = await req.db.parkingZone.update({
        where: {
          id: req.params.id
        },
        data: req.body
      })

      res.json({ data: parkingZone })
    } catch (e) {
      if (isPrismaError(e, 'P2025')) {
        throw createError(404, 'Parking zone not found')
      }

      throw e
    }
  })
]
