const { Router } = require('express')

const authController = require('./controllers/auth.controller')
const userController = require('./controllers/user.controller')
const bikeController = require('./controllers/bike.controller')
const chargingStationController = require('./controllers/charging-stations.controller')
const parkingZoneController = require('./controllers/parking-zones.controller')
const { auth } = require('./middleware/auth')

const router = new Router()

router.get('/auth/me', authController.getCurrentUser)
router.get('/auth/github', authController.githubAuth)
router.get('/auth/github/callback', authController.githubCallback)

router.get('/users', auth('ADMIN'), userController.getAllUsers)
router.get('/users/:id', auth('ADMIN'), userController.getOneUser)
router.patch('/users/:id', auth('ADMIN'), userController.updateUser)
router.delete('/users/:id', auth('ADMIN'), userController.deleteUser)

router.get('/bikes', bikeController.getAllBikes)
router.post('/bikes', bikeController.createBike)
router.get('/bikes/:id', bikeController.getOneBike)
router.patch('/bikes/:id', bikeController.updateBike)
router.delete('/bikes/:id', bikeController.deleteBike)

router.post('/bikes/:id/start', bikeController.startRide)
router.post('/bikes/:id/end', bikeController.endRide)
router.post('/bikes/:id/status', bikeController.updateStatus)

router.get('/charging-stations', chargingStationController.getAllStations)
router.post('/charging-stations', chargingStationController.createStation)
router.delete('/charging-stations/:id', chargingStationController.deleteStation)
router.get('/charging-stations/:id', chargingStationController.getOneStation)
router.patch('/charging-stations/:id', chargingStationController.updateStation)

router.get('/parking-zones', parkingZoneController.getAllParkingZones)
router.post('/parking-zones', parkingZoneController.createParkingZone)
router.delete('/parking-zones/:id', parkingZoneController.deleteParkingZone)
router.get('/parking-zones/:id', parkingZoneController.getOneParkingZone)

module.exports = {
  router
}
