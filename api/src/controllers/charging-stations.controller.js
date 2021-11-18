/// <reference path="../polyfill.d.ts" />

const createError = require('http-errors')
const { checkSchema } = require('express-validator')

const { useAsync } = require('../utils/express')
const { auth } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const { isPrismaError } = require('../utils/prisma')

module.exports.getAllStations = [
  auth('ADMIN'),

  useAsync(async (req, res) => {
    const stations = await req.db.chargingStation.findMany()
    res.json({ data: stations })
  })
]

module.exports.createStation = [
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
    const station = await req.db.chargingStation.create({
      data: {
        latitudeStart: req.body.latitudeStart,
        longitudeStart: req.body.longitudeStart,
        latitudeEnd: req.body.latitudeEnd,
        longitudeEnd: req.body.longitudeEnd
      }
    })
    res.json({ data: station })
  })
]

module.exports.deleteStation = [
  auth('ADMIN'),

  useAsync(async (req, res) => {
    try {
      const station = await req.db.chargingStation.delete({
        where: {
          id: req.params.id
        }
      })

      res.json({ data: station })
    } catch (e) {
      if (isPrismaError(e, 'P2025')) {
        throw createError(404, 'Charging station not found')
      }

      throw e
    }
  })
]

module.exports.getOneStation = [
  auth('ADMIN'),

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

module.exports.updateStation = [
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
      const station = await req.db.chargingStation.update({
        where: {
          id: req.params.id
        },
        data: req.body
      })

      res.json({ data: station })
    } catch (e) {
      if (isPrismaError(e, 'P2025')) {
        throw createError(404, 'Charging station not found')
      }

      throw e
    }
  })
]
