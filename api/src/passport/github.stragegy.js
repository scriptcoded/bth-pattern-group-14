const GitHubStrategy = require('passport-github2')
const fetch = require('node-fetch')

const { config } = require('../config')
const { prisma } = require('../utils/prisma')

module.exports.githubStrategy = new GitHubStrategy(
  {
    clientID: config.passport.githubClientID,
    clientSecret: config.passport.githubClientSecret,
    callbackURL: `${config.apiURL}/auth/github/callback`
  },
  function (accessToken, refreshToken, profile, done) {
    fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${accessToken}`
      }
    })
      .then(res => res.json())
      .then((emails) => {
        const primaryRecord = emails.find(email => email.primary) || emails[0]

        prisma.user.upsert({
          where: {
            githubId: profile.id
          },
          create: {
            githubId: profile.id,
            name: profile.displayName,
            email: primaryRecord.email
          },
          update: {
            name: profile.displayName
          }
        })
          .then(user => done(null, user))
          .catch(err => done(err))
      })
      .catch(err => done(err))
  }
)
