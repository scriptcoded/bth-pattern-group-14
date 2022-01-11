const { prismaMock } = require('../utils/tests/mockPrisma')
const { createWaitableMock, getControllerMethod } = require('../utils/tests/tests')

const restController = require('./rest.controller')

const mockChargingZones = [
  {
    id: 'a',
    latitudeStart: 1,
    longitudeStart: 2,
    latitudeEnd: 3,
    longitudeEnd: 4
  },
  {
    id: 'b',
    latitudeStart: 5,
    longitudeStart: 6,
    latitudeEnd: 7,
    longitudeEnd: 8
  }
]


const mockParkingZones = [
  {
    id: 'a',
    latitudeStart: 1,
    longitudeStart: 2,
    latitudeEnd: 3,
    longitudeEnd: 4
  },
  {
    id: 'b',
    latitudeStart: 5,
    longitudeStart: 6,
    latitudeEnd: 7,
    longitudeEnd: 8
  }
]

const mockDrivingZones = [
  {
    id: 'a',
    latitudeStart: 1,
    longitudeStart: 2,
    latitudeEnd: 3,
    longitudeEnd: 4
  },
  {
    id: 'b',
    latitudeStart: 5,
    longitudeStart: 6,
    latitudeEnd: 7,
    longitudeEnd: 8
  }
]

const mockBikes = [
  {
    id: 'a',
    latitude: 1,
    longitude: 2,
    battery: 59,
    speed: 8,
    disabled: false
  },
  {
    id: 'b',
    latitude: 3,
    longitude: 4,
    battery: 37,
    speed: 0,
    disabled: false
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

  getControllerMethod(restController.getAllBikes)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockBikes })
})

test('getOneBike respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(restController.getOneBike)(req, res, next)
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

  getControllerMethod(restController.getOneBike)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockBikes[0] })
})

test('getAllChargingStations returns correct charging stations', async () => {
  req.db.chargingStation.findMany.mockResolvedValue(mockChargingZones)

  getControllerMethod(restController.getAllChargingStations)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockChargingZones })
})

test('getOneChargingStation respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(restController.getOneChargingStation)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.chargingStation.findUnique).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('getOneChargingStation returns correct charging station', async () => {
  req.db.chargingStation.findUnique.mockResolvedValue(mockChargingZones[0])
  req.params.id = 'a'

  getControllerMethod(restController.getOneChargingStation)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockChargingZones[0] })
})

test('getAllParkingZones returns correct parking zones', async () => {
  req.db.parkingZone.findMany.mockResolvedValue(mockChargingZones)

  getControllerMethod(restController.getAllParkingZones)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockChargingZones })
})

test('getOneParkingZone respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(restController.getOneParkingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.parkingZone.findUnique).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('getOneParkingZone returns correct parking zone', async () => {
  req.db.parkingZone.findUnique.mockResolvedValue(mockChargingZones[0])
  req.params.id = 'a'

  getControllerMethod(restController.getOneParkingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockChargingZones[0] })
})

test('getAllDrivingZones returns correct driving zones', async () => {
  req.db.drivingZone.findMany.mockResolvedValue(mockDrivingZones)

  getControllerMethod(restController.getAllDrivingZones)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockDrivingZones })
})

test('getOneDrivingZone respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(restController.getOneDrivingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.drivingZone.findUnique).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('getOneDrivingZone returns correct driving zone', async () => {
  req.db.drivingZone.findUnique.mockResolvedValue(mockDrivingZones[0])
  req.params.id = 'a'

  getControllerMethod(restController.getOneDrivingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockDrivingZones[0] })
})
