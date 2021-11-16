const { PrismaClient } = require('@prisma/client')
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime')

module.exports.prisma = new PrismaClient()

/**
 * Check if an error is a Prisma error and optionally has the specified error
 * code.
 *
 * List of error codes:
 * https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
 * @param {any} error The error to check
 * @param {string} [code] The error code to check for
 */
module.exports.isPrismaError = function isPrismaError (error, code) {
  return error instanceof PrismaClientKnownRequestError && (!code || (error.code === code))
}
