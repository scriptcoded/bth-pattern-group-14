/// <reference path="../polyfill.d.ts" />

const createError = require('http-errors')
const { checkSchema } = require('express-validator')

const { useAsync } = require('../utils/express')
// const { auth } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const { isPrismaError } = require('../utils/prisma')

module.exports.getAllDrivingZones = [
  useAsync(async (req, res) => {
    const zones = await req.db.drivingZone.findMany()
    res.json({ data: zones })
  })
]

module.exports.createDrivingZone = [
  checkSchema({
    name: {
      isString: true,
      errorMessage: 'Name end must be a string'
    },
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
    const drivingZone = await req.db.drivingZone.create({
      data: {
        name: req.body.name,
        latitudeStart: req.body.latitudeStart,
        longitudeStart: req.body.longitudeStart,
        latitudeEnd: req.body.latitudeEnd,
        longitudeEnd: req.body.longitudeEnd
      }
    })
    res.json({ data: drivingZone })
  })
]

module.exports.deleteDrivingZone = [
  useAsync(async (req, res) => {
    try {
      const drivingZone = await req.db.drivingZone.delete({
        where: {
          id: req.params.id
        }
      })

      res.json({ data: drivingZone })
    } catch (e) {
      if (isPrismaError(e, 'P2025')) {
        throw createError(404, 'Driving zone not found')
      }

      throw e
    }
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

module.exports.updateDrivingZone = [
  checkSchema({
    name: {
      optional: true,
      isString: true,
      errorMessage: 'Name end must be a string'
    },
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
      const drivingZone = await req.db.drivingZone.update({
        where: {
          id: req.params.id
        },
        data: req.body
      })

      res.json({ data: drivingZone })
    } catch (e) {
      if (isPrismaError(e, 'P2025')) {
        throw createError(404, 'Driving zone not found')
      }

      throw e
    }
  })
]
