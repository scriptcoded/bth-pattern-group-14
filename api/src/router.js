const { Router } = require('express')

const authController = require('./controllers/auth.controller')
const paymentController = require('./controllers/payment.controller')
const userController = require('./controllers/user.controller')
const bikeController = require('./controllers/bike.controller')
const chargingStationController = require('./controllers/charging-stations.controller')
const parkingZoneController = require('./controllers/parking-zones.controller')
const drivingZoneController = require('./controllers/driving-zones.controller')
const applicationController = require('./controllers/application.controller')
const restController = require('./controllers/rest.controller')
const { bikeAuth } = require('./middleware/bikeAuth')
const { auth } = require('./middleware/auth')
const { restAuth } = require('./middleware/restAuth')
const { config } = require('./config')

const router = new Router()

router.get('/auth/me', auth(), authController.getCurrentUser)
router.get('/auth/github', authController.githubAuth)
router.get('/auth/github/callback', authController.githubCallback)
router.post('/auth/logout', authController.logout)

if (config.isSimulation) {
  router.post('/auth/simulation/login', authController.simulationLogin)
}

router.post('/payments/topup', auth(), paymentController.topup)
router.post('/payments/invoice', auth('ADMIN'), paymentController.invoice)
router.post('/payments/stripe/webhook', paymentController.stripeWebhook)

router.post('/payments/invoices/:id/check', paymentController.checkInvoice)

router.get('/users', auth('ADMIN'), userController.getAllUsers)
router.get('/users/:id', auth('ADMIN'), userController.getOneUser)
router.patch('/users/:id', auth('ADMIN'), userController.updateUser)
router.delete('/users/:id', auth('ADMIN'), userController.deleteUser)

router.get('/users/me/rides', auth(), userController.getMyRides)
router.get('/users/me/payments', auth(), userController.getMyPayments)

router.get('/bikes', bikeController.getAllBikes)
router.post('/bikes', auth('ADMIN'), bikeController.createBike)
router.get('/bikes/:id', auth(), bikeController.getOneBike)
router.patch('/bikes/:id', auth('ADMIN'), bikeController.updateBike)
router.delete('/bikes/:id', auth('ADMIN'), bikeController.deleteBike)

router.post('/bikes/:id/start', auth(), bikeController.startRide)
router.post('/bikes/:id/end', auth(), bikeController.endRide)
router.post('/bikes/:id/status', bikeAuth(), bikeController.updateStatus)

router.get('/charging-stations', chargingStationController.getAllStations)
router.post('/charging-stations', auth('ADMIN'), chargingStationController.createStation)
router.delete('/charging-stations/:id', auth('ADMIN'), chargingStationController.deleteStation)
router.get('/charging-stations/:id', auth('ADMIN'), chargingStationController.getOneStation)
router.patch('/charging-stations/:id', auth('ADMIN'), chargingStationController.updateStation)

router.get('/parking-zones', parkingZoneController.getAllParkingZones)
router.post('/parking-zones', auth('ADMIN'), parkingZoneController.createParkingZone)
router.delete('/parking-zones/:id', auth('ADMIN'), parkingZoneController.deleteParkingZone)
router.get('/parking-zones/:id', auth('ADMIN'), parkingZoneController.getOneParkingZone)
router.patch('/parking-zones/:id', auth('ADMIN'), parkingZoneController.updateParkingZone)

router.get('/driving-zones', drivingZoneController.getAllDrivingZones)
router.post('/driving-zones', auth('ADMIN'), drivingZoneController.createDrivingZone)
router.delete('/driving-zones/:id', auth('ADMIN'), drivingZoneController.deleteDrivingZone)
router.get('/driving-zones/:id', auth('ADMIN'), drivingZoneController.getOneDrivingZone)
router.patch('/driving-zones/:id', auth('ADMIN'), drivingZoneController.updateDrivingZone)

router.get('/applications', auth('ADMIN'), applicationController.getAllApplications)
router.post('/applications', auth('ADMIN'), applicationController.createApplication)
router.delete('/applications/:id', auth('ADMIN'), applicationController.deleteApplication)
router.get('/applications/:id', auth('ADMIN'), applicationController.getOneApplication)
router.patch('/applications/:id', auth('ADMIN'), applicationController.updateApplication)

router.get('/rest/v1/bikes', restAuth(), restController.getAllBikes)
router.get('/rest/v1/bikes/:id', restAuth(), restController.getOneBike)
router.get('/rest/v1/charging-stations', restAuth(), restController.getAllChargingStations)
router.get('/rest/v1/charging-stations/:id', restAuth(), restController.getOneChargingStation)
router.get('/rest/v1/parking-zones', restAuth(), restController.getAllParkingZones)
router.get('/rest/v1/parking-zones/:id', restAuth(), restController.getOneParkingZone)
router.get('/rest/v1/driving-zones', restAuth(), restController.getAllDrivingZones)
router.get('/rest/v1/driving-zones/:id', restAuth(), restController.getOneDrivingZone)

module.exports = {
  router
}
