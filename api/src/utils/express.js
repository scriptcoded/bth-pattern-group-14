const createError = require('http-errors')

/**
 * Takes a function that returns a promise and passes any errors thrown from it
 * to the `nest` handler from Express.
 *
 * This is necessary because Express does not have support for promises and
 * async functions.
 *
 * @param {import("express").RequestHandler} callback Async Express handler function
 */
module.exports.useAsync = function useAsync (callback) {
  return function (req, res, next) {
    callback(req, res, next)
      .catch(next)
  }
}

/**
 * Custom error handler for showing HTTP errors.
 */
module.exports.errorHandler = function errorHandler (err, req, res, next) {
  const isHttpError = createError.isHttpError(err)

  // If it's not an HTTP error or if it has a status code of 500 or above, log it
  if (!isHttpError || err.status >= 500) {
    console.error('Fatal error:', err)
  }

  // If it's not an HTTP error, mask it as a 500 error so that we don't leak
  // sensitive or critical information
  if (!isHttpError) {
    err = createError(500)
  }

  // Only show the error message if it's been marked with the `expose` flag.
  // By default this is true for all messages < 500.
  const message = err.expose ? err.message : null

  res
    .status(err.status)
    .send({
      error: {
        message,
        name: err.name
      }
    })
}
