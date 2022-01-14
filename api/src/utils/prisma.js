const { PrismaClient } = require('@prisma/client')
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime')

const prisma = new PrismaClient()

/**
 * Check if an error is a Prisma error and optionally has the specified error
 * code.
 *
 * List of error codes:
 * https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
 * @param {any} error The error to check
 * @param {string} [code] The error code to check for
 */
function isPrismaError (error, code) {
  return error instanceof PrismaClientKnownRequestError && (!code || (error.code === code))
}

module.exports = {
  prisma,
  isPrismaError
}
