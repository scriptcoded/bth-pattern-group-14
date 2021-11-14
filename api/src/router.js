const { Router } = require('express')

const authController = require('./controllers/auth.controller')
const userController = require('./controllers/user.controller')

const router = new Router()

router.get('/auth/me', authController.getCurrentUser)
router.get('/auth/github', authController.githubAuth)
router.get('/auth/github/callback', authController.githubCallback)

router.get('/users', userController.getAllUsers)

module.exports = {
  router
}
