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
    const email = profile.emails.length && profile.emails[0].value
      ? profile.emails[0].value
      : profile._json.email

    prisma.user.upsert({
      where: {
        githubId: profile.id
      },
      create: {
        githubId: profile.id,
        name: profile.displayName,
        email
      },
      update: {
        name: profile.displayName
      }
    })
      .then(user => done(null, user))
      .catch(err => done(err))
  }
)
