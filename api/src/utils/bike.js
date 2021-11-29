/**
 * Generates a random four character string for bike identification.
 * @returns {string}
 */
module.exports.generateBikeID = function generateBikeID () {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  for (let i = 0; i < 5; i++) {
    result += characters[Math.floor(Math.random() * characters.length - 0.01)]
  }

  return result
}
