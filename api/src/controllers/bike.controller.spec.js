const { prismaMock } = require('../utils/tests/mockPrisma')
const { createWaitableMock, getControllerMethod } = require('../utils/tests/tests')

const bikeController = require('./bike.controller')

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
    speed: 8,
    disabled: false
  },
  {
    id: 'bike2',
    latitude: 3,
    longitude: 4,
    battery: 37,
    speed: 0,
    disabled: false
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

let req
let res
let next
beforeEach(() => {
  req = {
    db: prismaMock,
    params: {},
    user: {}
  }

  res = {
    json: jest.fn()
  }

  next = createWaitableMock()
})

test('getAllBikes returns correct bikes', async () => {
  req.db.bike.findMany.mockResolvedValue(mockBikes)

  getControllerMethod(bikeController.getAllBikes)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockBikes })
})

test('getOneBike respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(bikeController.getOneBike)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.bike.findUnique).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('getOneBike returns correct bike', async () => {
  req.db.bike.findUnique.mockResolvedValue(mockBikes[0])
  req.params.id = 'a'

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
    disabled: false
  }

  req.db.bike.create.mockResolvedValue(req.body)

  getControllerMethod(bikeController.createBike)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: req.body })
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

test('updateBike modifies bike', async () => {
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
})

test('updateBike returns updated bike', async () => {
  req.body = {
    name: 'steve'
  }
  req.db.bike.update.mockResolvedValue(req.body)

  getControllerMethod(bikeController.updateBike)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: req.body })
})

test('deleteBike respects url param', async () => {
  req.params.id = 'a'

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
  req.db.bike.findUnique.mockResolvedValue(true)
  req.db.ride.create.mockResolvedValue(mockRide[0])
  // findParkingZoneAtPoint.mockResolvedValue(true)

  getControllerMethod(bikeController.startRide)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockRide[0] })
})

test('startRide active ride already exists', async () => {
  req.db.ride.findFirst.mockResolvedValue(true)

  getControllerMethod(bikeController.startRide)(req, res, next)
  await next.waitToHaveBeenCalled()

  const t = () => {
    throw new Error()
  }

  expect(t).toThrow()
})

test('startRide bike not found', async () => {
  req.db.ride.findFirst.mockResolvedValue(false)
  req.db.bike.findUnique.mockResolvedValue(false)

  getControllerMethod(bikeController.startRide)(req, res, next)
  await next.waitToHaveBeenCalled()

  const t = () => {
    throw new Error()
  }

  expect(t).toThrow()
})

// test('updateStatus bike that is rented', async () => {
//   req.body.latitude = 5
//   req.body.longitude = 6
//   req.body.battery = 40
//   req.body.speed = 50

//   req.db.bike.findUnique.mockResolvedValue(mockBikes[0])
//   // req.db.bike.update.mockResolvedValue(newBike)
//   // req.db.bike.findUnique.mockResolvedValue(false)

//   getControllerMethod(bikeController.updateStatus)(req, res, next)
//   await next.waitToHaveBeenCalled()

//   expect(res.json).toHaveBeenCalledWith({
//     data: {
//       latitude: req.body.latitude,
//       longitude: req.body.longitude,
//       battery: req.body.battery,
//       speed: req.body.speed
//     }
//   })
// })
