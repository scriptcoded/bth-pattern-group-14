const createError = require('http-errors')

/**
 * Verifies that the user is logged in. Optionally takes a list of roles of
 * which the user must have at least one.
 * @param  {...import("@prisma/client").Role} roles a list of roles of which the user must have at least one
 * @returns {import("express").RequestHandler}
 */
module.exports.auth = (...roles) => function auth (req, res, next) {
  if (req.isUnauthenticated()) {
    next(createError(401, 'You must be logged in to access this resource.'))
    return
  }

  if (roles.length > 0 && !roles.includes(req.user.role)) {
    next(createError(403, 'You do not have permission to access this resource.'))
    return
  }

  next()
}
