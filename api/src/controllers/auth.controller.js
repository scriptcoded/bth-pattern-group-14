/// <reference path="../polyfill.d.ts" />

const passport = require('passport')
const createError = require('http-errors')

const { config } = require('../config')
const { useAsync } = require('../utils/express')

module.exports.getCurrentUser = [
  useAsync((req, res) => {
    res.json({ data: req.user })
  })
]

module.exports.githubAuth = passport.authenticate('github', {
  scope: ['user', 'read:user']
})

module.exports.githubCallback = [
  /**
   * Custom authentication callback to send query params to frontend in case of
   * failure.
   * @type {import("express").RequestHandler}
   */
  (req, res, next) => passport.authenticate('github', {}, (err, user) => {
    if (err) {
      console.error('Error from passport:', err)
      return next(err)
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
          return next(err)
        }
        res.redirect(config.frontendURL)
      })
    }
  })(req, res, next)
]

module.exports.logout = [
  /**
   * @type {import("express").RequestHandler}
   */
  (req, res) => {
    req.logout()
    res.json({})
  }
]

module.exports.simulationLogin = [
  /**
   * @type {import("express").RequestHandler}
   */
  useAsync(async (req, res) => {
    if (!config.isSimulation) {
      res.status(404)
      return
    }

    const user = await req.db.user.findUnique({
      where: {
        id: req.body.id
      },
      include: {
        rides: {
          where: {
            endTime: null
          }
        }
      }
    })

    if (!user) {
      throw createError(404, 'User not found')
    }

    await new Promise((resolve, reject) => {
      req.login(user, (err) => {
        if (err) { reject(err) }
        resolve()
      })
    })

    res.send({
      data: user
    })
  })
]
