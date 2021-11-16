/// <reference path="../polyfill.d.ts" />

const passport = require('passport')

const { config } = require('../config')
const { auth } = require('../middleware/auth')
const { useAsync } = require('../utils/express')

module.exports.getCurrentUser = [
  auth(),

  useAsync((req, res) => {
    res.send({ data: req.user })
  })
]

module.exports.githubAuth = passport.authenticate('github', {
  scope: ['user:email', 'read:user']
})

module.exports.githubCallback = [
  /**
   * Custom authentication callback to send query params to frontend in case of
   * failure.
   * @type {import("express").RequestHandler}
   */
  (req, res, next) => passport.authenticate('github', {}, (err, user) => {
    if (err) {
      throw err
    }

    if (!user) {
      const url = new URL(`${config.frontendURL}/login`)
      for (const name in req.query) {
        url.searchParams.set(name, req.query[name])
      }

      res.redirect(url.href)
    } else {
      // Set the user in the session
      req.login(user, (err) => {
        if (err) {
          console.error('Error while setting user:', err)
          next(err)
          return
        }
        res.redirect(config.frontendURL)
      })
    }
  })(req, res, next)
]
