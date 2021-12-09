const crypto = require('crypto')

/**
 * Generates a cryptographically secure random token.
 * @param {Number} length Length of the token to generate. Defaults to 48.
 */
module.exports.generateToken = function generateToken (length = 48) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buffer) => {
      if (err) {
        return reject(err)
      }

      resolve(buffer.toString('hex'))
    })
  })
}
