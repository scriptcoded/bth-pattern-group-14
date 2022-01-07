const createError = require('http-errors')

const { prisma } = require('../utils/prisma')
const { useAsync } = require('../utils/express')

/**
 * Verifies the identity of an application.
 * @returns {import("express").RequestHandler}
 */
module.exports.restAuth = () => useAsync(async function restAuth (req, res) {
  let application
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1]

    application = await prisma.applications.findFirst({
      where: {
        token
      }
    })
  }

  if (!application) {
    throw createError(401, 'REST authentication required')
  }

  // Could be done instead of the findFirst to improve performance.
  await prisma.applications.update({
    data: {
      apiCalls: {
        increment: 1
      }
    },
    where: {
      id: application.id
    }
  })
})
