/// <reference path="../polyfill.d.ts" />

const createError = require('http-errors')
const { body } = require('express-validator')

const { useAsync } = require('../utils/express')
const { auth } = require('../middleware/auth')

module.exports.getAllUsers = [
  auth('ADMIN'),

  useAsync(async (req, res) => {
    const users = await req.db.user.findMany()
    res.json({ data: users })
  })
]
