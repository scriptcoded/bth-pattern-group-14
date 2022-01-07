/// <reference path="../polyfill.d.ts" />

const createError = require('http-errors')
const { checkSchema } = require('express-validator')

const { useAsync } = require('../utils/express')
const { validate } = require('../middleware/validate')
const { isPrismaError } = require('../utils/prisma')
const { generateToken } = require('../utils/crypto')

module.exports.getAllApplications = [
  useAsync(async (req, res) => {
    const applications = await req.db.applications.findMany()
    res.json({ data: applications })
  })
]

module.exports.createApplication = [
  checkSchema({
    name: {
      isString: true,
      errorMessage: 'Name start must be a string'
    }
  }),

  validate(),

  useAsync(async (req, res) => {
    const token = await generateToken()

    const application = await req.db.applications.create({
      data: {
        name: req.body.name,
        token
      }
    })
    res.json({ data: application })
  })
]

module.exports.deleteApplication = [
  useAsync(async (req, res) => {
    try {
      const application = await req.db.applications.delete({
        where: {
          id: req.params.id
        }
      })

      res.json({ data: application })
    } catch (e) {
      if (isPrismaError(e, 'P2025')) {
        throw createError(404, 'Application not found')
      }

      throw e
    }
  })
]

module.exports.getOneApplication = [
  useAsync(async (req, res) => {
    const application = await req.db.applications.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!application) {
      throw createError(404, 'Application not found')
    }

    res.json({ data: application })
  })
]

module.exports.updateApplication = [
  checkSchema({
    name: {
      optional: true,
      isString: true,
      errorMessage: 'Name start must be a string'
    },
    apiCalls: {
      optional: true,
      isInt: true,
      errorMessage: 'Name start must be an integer'
    }
  }),

  validate(),

  useAsync(async (req, res) => {
    try {
      const application = await req.db.applications.update({
        where: {
          id: req.params.id
        },
        data: req.body
      })

      res.json({ data: application })
    } catch (e) {
      if (isPrismaError(e, 'P2025')) {
        throw createError(404, 'Application not found')
      }

      throw e
    }
  })
]
