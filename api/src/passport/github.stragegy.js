const GitHubStrategy = require('passport-github2')

const { config } = require('../config')
const { prisma } = require('../utils/prisma')

module.exports.githubStrategy = new GitHubStrategy(
  {
    clientID: config.passport.githubClientID,
    clientSecret: config.passport.githubClientSecret,
    callbackURL: `${config.apiURL}/auth/github/callback`
  },
  function (accessToken, refreshToken, profile, done) {
    prisma.user.upsert({
      where: {
        githubId: profile.id
      },
      create: {
        githubId: profile.id,
        name: profile.displayName
      },
      update: {
        name: profile.displayName
      }
    })
      .then(user => done(null, user))
      .catch(err => done(err))
  }
)
