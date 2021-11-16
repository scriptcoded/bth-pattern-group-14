/// <reference path="../polyfill.d.ts" />

const createError = require('http-errors')
const { checkSchema } = require('express-validator')
const { Role } = require('@prisma/client')

const { useAsync } = require('../utils/express')
const { auth } = require('../middleware/auth')
const { validate } = require('../middleware/validate')
const { isPrismaError } = require('../utils/prisma')

module.exports.getAllUsers = [
  auth('ADMIN'),

  useAsync(async (req, res) => {
    const users = await req.db.user.findMany()
    res.json({ data: users })
  })
]

module.exports.getOneUser = [
  auth('ADMIN'),

  useAsync(async (req, res) => {
    const user = await req.db.user.findUnique({
      where: {
        id: req.params.id
      }
    })

    if (!user) {
      throw createError(404, 'User not found')
    }

    res.json({ data: user })
  })
]

module.exports.updateUser = [
  auth('ADMIN'),

  checkSchema({
    name: {
      isString: true,
      optional: true,
      errorMessage: 'name must be a string'
    },
    role: {
      optional: true,
      isIn: { options: [Object.values(Role)] },
      errorMessage: 'role must be one of the following: ' + Object.values(Role)
    }
  }),

  validate(),

  useAsync(async (req, res) => {
    try {
      const user = await req.db.user.update({
        where: {
          id: req.params.id
        },
        data: req.body
      })

      res.json({ data: user })
    } catch (e) {
      if (isPrismaError(e, 'P2025')) {
        throw createError(404, 'User not found')
      }

      throw e
    }
  })
]

module.exports.deleteUser = [
  auth('ADMIN'),

  useAsync(async (req, res) => {
    try {
      const user = await req.db.user.delete({
        where: {
          id: req.params.id
        }
      })

      res.json({ data: user })
    } catch (e) {
      if (isPrismaError(e, 'P2025')) {
        throw createError(404, 'User not found')
      }

      throw e
    }
  })
]
