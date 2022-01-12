const createError = require('http-errors')

const { config } = require('../config')
const { prisma } = require('../utils/prisma')
const { useAsync } = require('../utils/express')

/**
 * Verifies the identity of a bike using it's token.
 * @returns {import("express").RequestHandler}
 */
module.exports.bikeAuth = (idParam = 'id') => useAsync(async function bikeAuth (req, res, next) {
  if (config.isSimulation) { return }

  let bike
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1]

    bike = await prisma.bike.findFirst({
      where: {
        id: req.params[idParam],
        token
      }
    })
  }

  if (!bike) {
    throw createError(401, 'Bike authentication required')
  }
})
