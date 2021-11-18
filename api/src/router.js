const { Router } = require('express')

const authController = require('./controllers/auth.controller')
const userController = require('./controllers/user.controller')
const bikeController = require('./controllers/bike.controller')

const router = new Router()

router.get('/auth/me', authController.getCurrentUser)
router.get('/auth/github', authController.githubAuth)
router.get('/auth/github/callback', authController.githubCallback)

router.get('/users', userController.getAllUsers)
router.get('/users/:id', userController.getOneUser)
router.patch('/users/:id', userController.updateUser)
router.delete('/users/:id', userController.deleteUser)

router.get('/bikes', bikeController.getAllBikes)
router.post('/bikes', bikeController.createBike)
router.get('/bikes/:id', bikeController.getOneBike)
router.patch('/bikes/:id', bikeController.updateBike)
router.delete('/bikes/:id', bikeController.deleteBike)

module.exports = {
  router
}
