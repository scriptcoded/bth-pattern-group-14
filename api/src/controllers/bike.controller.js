/// <reference path="../polyfill.d.ts" />

const createError = require('http-errors')
const { checkSchema } = require('express-validator')

const { useAsync } = require('../utils/express')
const { auth } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const { isPrismaError } = require('../utils/prisma')
const { generateBikeID } = require('../utils/bike')

module.exports.getAllBikes = [
  auth('ADMIN'),

  useAsync(async (req, res) => {
    const bikes = await req.db.bike.findMany()
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
            longitude: req.body.longitude
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

      res.json({ data: bike })
    } catch (e) {
      if (isPrismaError(e, 'P2025')) {
        throw createError(404, 'Bike not found')
      }

      throw e
    }
  })
]
