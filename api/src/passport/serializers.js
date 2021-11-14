const { prisma } = require('../utils/prisma')

module.exports.serializeUser = function serializeUser (user, done) {
  done(null, user.id)
}

module.exports.deserializeUser = function deserializeUser (userId, done) {
  prisma.user.findUnique({
    where: {
      id: userId
    }
  })
    .then(user => done(null, user))
    .catch(err => done(err))
}
