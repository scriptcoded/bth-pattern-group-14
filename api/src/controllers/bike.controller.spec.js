const { prismaMock } = require('../utils/tests/mockPrisma')
const { createWaitableMock, getControllerMethod } = require('../utils/tests/tests')
// const { findParkingZoneAtPoint, findChargingStationAtPoint } = require('../utils/zone')
// const paymentService = require('../services/payment.service')

const bikeController = require('./bike.controller')

// jest.mock('../utils/zone')

const mockUsers = [
  {
    id: 'user1'
  }
]

const mockBikes = [
  {
    id: 'bike1',
    latitude: 1,
    longitude: 2,
    battery: 59,
    speed: 9,
    disabled: false,
    rides: 'ride1'
  },
  {
    id: 'bike2',
    latitude: 3,
    longitude: 4,
    battery: 37,
    speed: 0,
    disabled: false,
    rides: ''
  }
]

const mockRide = [
  {
    bike: {
      connect: {
        id: mockUsers[0].id
      }
    },
    user: {
      connect: {
        id: mockUsers[0].id
      }
    },
    startTime: new Date(),
    fromParkingZone: true,
    startLatitude: mockBikes[0].latitude,
    startLongitude: mockBikes[0].longitude
  },
  {
    endTime: new Date(),
    toParkingZone: true,
    endLatitude: mockBikes[0].latitude,
    endLongitude: mockBikes[0].longitude,
    chargedAmount: 20
  }
]

// jest.mock('../utils/zone', () => {
//   const originalModule = jest.requireActual('../utils/zone')

//   return {
//     __esModule: true,
//     ...originalModule,
//     findParkingZoneAtPoint: false,
//     findChargingStationAtPoint: false
//   }
// })

let req
let res
let next
let throwError
beforeEach(() => {
  req = {
    db: prismaMock,
    params: {},
    user: {}
  }

  throwError = () => { throw new Error() }

  res = {
    json: jest.fn()
  }

  mockBikes[0].rides = {
    bike: {
      connect: {
        id: mockUsers[0].id
      }
    },
    endTime: null
  }

  mockBikes[1].rides = {
    bike: {
      connect: {
        id: mockUsers[0].id
      }
    },
    endTime: new Date()
  }

  mockUsers[0].rides = {
    bike: {
      connect: {
        id: mockUsers[0].id
      }
    },
    endTime: null
  }

  next = createWaitableMock()
})

test('getAllBikes returns correct bikes', async () => {
  req.db.bike.findMany.mockResolvedValue(mockBikes)

  getControllerMethod(bikeController.getAllBikes)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockBikes })
})

test('getAllBikes is admin', async () => {
  req.user = {
    role: 'ADMIN'
  }
  req.db.bike.findMany.mockResolvedValue(mockBikes)

  getControllerMethod(bikeController.getAllBikes)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockBikes })
})

test('getOneBike respects url param', async () => {
  req.params.id = 'bike1'

  getControllerMethod(bikeController.getOneBike)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.bike.findUnique).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('getOneBike returns correct bike', async () => {
  req.params.id = 'bike1'
  req.db.bike.findUnique.mockResolvedValue(mockBikes[0])

  getControllerMethod(bikeController.getOneBike)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockBikes[0] })
})

test('createBike creates a bike', async () => {
  req.body = {
    id: 'c',
    latitude: 3,
    longitude: 4,
    battery: 37,
    speed: 0,
    disabled: false,
    available: true
  }

  req.db.bike.create.mockResolvedValue(req.body)

  getControllerMethod(bikeController.createBike)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: req.body })
})

test('createBike throws error when failed to generate uniqe id', async () => {
  req.db.bike.create.mockResolvedValue(false)

  getControllerMethod(bikeController.createBike)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(throwError).toThrow()
})

test('createBike throws error when failed to create bike', async () => {
  req.body = {
    latitude: mockBikes[0].latitude,
    longitude: mockBikes[0].longitude
  }
  req.db.bike.create.mockResolvedValue(false)
  getControllerMethod(bikeController.createBike)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(throwError).toThrow()
})

test('updateBike respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(bikeController.updateBike)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.bike.update).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('updateBike throws error not updating bike', async () => {
  req.body = {
    name: 'steve'
  }

  getControllerMethod(bikeController.updateBike)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.bike.update).toHaveBeenCalledWith(expect.objectContaining({
    data: {
      name: req.body.name
    }
  }))
  expect(throwError).toThrow()
})

test('updateBike returns updated bike', async () => {
  req.body = {
    disabled: true
  }
  req.params.id = 'bike1'
  req.db.bike.update.mockResolvedValue(mockBikes[0])

  getControllerMethod(bikeController.updateBike)(req, res, next)
  await next.waitToHaveBeenCalled()

  mockBikes[0].disabled = true

  expect(res.json).toHaveBeenCalledWith({ data: mockBikes[0] })
})

test('deleteBike respects url param', async () => {
  req.params.id = 'bike1'

  getControllerMethod(bikeController.deleteBike)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.bike.delete).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('deleteBike returns deleted bike', async () => {
  req.db.bike.delete.mockResolvedValue(mockBikes[0])

  getControllerMethod(bikeController.deleteBike)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockBikes[0] })
})

test('startRide returns data from ride', async () => {
  req.db.ride.findFirst.mockResolvedValue(false)
  req.db.user.findUnique.mockResolvedValue(mockUsers[0])
  req.db.bike.findUnique.mockResolvedValue(true)
  req.db.ride.create.mockResolvedValue(mockRide[0])

  getControllerMethod(bikeController.startRide)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockRide[0] })
})

test('startRide active ride already exists', async () => {
  req.db.ride.findFirst.mockResolvedValue(true)

  getControllerMethod(bikeController.startRide)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(throwError).toThrow()
})

test('startRide bike not found', async () => {
  req.db.ride.findFirst.mockResolvedValue(false)
  req.db.user.findUnique.mockResolvedValue(mockUsers[0])
  req.db.bike.findUnique.mockResolvedValue(false)

  getControllerMethod(bikeController.startRide)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(throwError).toThrow()
})

test('startRide user already active', async () => {
  const mockUserError = {
    rides: 'active ride'
  }
  req.db.ride.findFirst.mockResolvedValue(false)
  req.db.user.findUnique.mockResolvedValue(mockUserError)

  getControllerMethod(bikeController.startRide)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(throwError).toThrow()
})

// test('endRide ends bike', async () => {
//   const mockUpdate = {
//     endTime: new Date(),
//     toParkingZone: false,
//     endLatitude: mockBikes[0].latitude,
//     endLongitude: mockBikes[0].longitude,
//     chargedAmount: 10
//   }

//   req.db.ride.findFirst.mockResolvedValue(true)
//   // req.db.bike.findUnique.mockResolvedValue(false)

//   // findParkingZoneAtPoint.mockResolvedValue({})
//   // findChargingStationAtPoint.mockResolvedValue({})
//   req.db.ride.update.mockResolvedValue(mockUpdate)

//   // spy on
//   jest.spyOn(paymentService, 'calculateRideCost').mockResolvedValue({})
//   jest.spyOn(paymentService, 'chargeUser').mockResolvedValue({})

//   getControllerMethod(bikeController.endRide)(req, res, next)
//   await next.waitToHaveBeenCalled()

//   expect(res.json).toHaveBeenCalledWith({ data: mockRide[0] })
// })

test('updateStatus bike that is rented', async () => {
  req.body = {
    latitude: 5,
    longitude: 6,
    battery: 40,
    speed: 50
  }

  req.db.bike.findUnique.mockResolvedValue(mockBikes[0])

  const mockUpdatedBike = {
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    battery: req.body.battery,
    speed: req.body.speed
  }

  req.db.bike.update.mockResolvedValue(mockBikes[0])

  getControllerMethod(bikeController.updateStatus)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({
    data: mockBikes[0]
  })
})

test('updateStatus with invalid bike returns error', async () => {
  req.body = {
    latitude: 5,
    longitude: 6,
    battery: 40,
    speed: 50
  }

  req.db.bike.findUnique.mockResolvedValue(false)

  getControllerMethod(bikeController.updateStatus)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(throwError).toThrow()
})
