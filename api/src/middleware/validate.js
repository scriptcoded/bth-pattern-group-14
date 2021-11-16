const { validationResult } = require('express-validator')
const createError = require('http-errors')

/**
 * Sends validation errors created by express-validator.
 * @type {import("express").RequestHandler}
 */
module.exports.validate = () => function validate (req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const err = createError(400, 'Validation error')
    err.fields = errors.array()
    return next(err)
    // return res.status(400).json({ errors: errors.array() })
  }

  next()
}
