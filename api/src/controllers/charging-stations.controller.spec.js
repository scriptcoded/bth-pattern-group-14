const createError = require('http-errors')
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime')

const { prismaMock } = require('../utils/tests/mockPrisma')
const { createWaitableMock, getControllerMethod } = require('../utils/tests/tests')

const chargingStationController = require('./charging-stations.controller')

const mockZones = [
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

let req
let res
let next
beforeEach(() => {
  req = {
    db: prismaMock,
    params: {}
  }

  res = {
    json: jest.fn()
  }

  next = createWaitableMock()
})

test('getAllStations returns correct charging stations', async () => {
  req.db.chargingStation.findMany.mockResolvedValue(mockZones)

  getControllerMethod(chargingStationController.getAllStations)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockZones })
})

test('getOneStation respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(chargingStationController.getOneStation)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.chargingStation.findUnique).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('getOneStation returns correct charging station', async () => {
  req.db.chargingStation.findUnique.mockResolvedValue(mockZones[0])
  req.params.id = 'a'

  getControllerMethod(chargingStationController.getOneStation)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockZones[0] })
})

test('createStation returns created charging station', async () => {
  req.body = {
    latitudeStart: 1,
    longitudeStart: 2,
    latitudeEnd: 3,
    longitudeEnd: 4
  }
  req.db.chargingStation.create.mockResolvedValue(req.body)

  getControllerMethod(chargingStationController.createStation)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: req.body })
})

test('updateStation respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(chargingStationController.updateStation)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.chargingStation.update).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('updateStation modifies charging station', async () => {
  req.body = {
    name: 'steve'
  }

  getControllerMethod(chargingStationController.updateStation)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.chargingStation.update).toHaveBeenCalledWith(expect.objectContaining({
    data: {
      name: req.body.name
    }
  }))
})

test('updateStation returns updated charging station', async () => {
  req.body = {
    name: 'steve'
  }
  req.db.chargingStation.update.mockResolvedValue(req.body)

  getControllerMethod(chargingStationController.updateStation)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: req.body })
})

test('deleteStation respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(chargingStationController.deleteStation)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.chargingStation.delete).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('deleteStation returns deleted charging station', async () => {
  req.db.chargingStation.delete.mockResolvedValue(mockZones[0])

  getControllerMethod(chargingStationController.deleteStation)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockZones[0] })
})

test('updateStation error: update charging zone not found', async () => {
  req.body = {
    latitudeStart: 1,
    longitudeStart: 2,
    latitudeEnd: 3,
    longitudeEnd: 4
  }
  req.db.chargingStation.update.mockRejectedValue(new PrismaClientKnownRequestError('test', 'P2025'))

  getControllerMethod(chargingStationController.updateStation)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(next).toHaveBeenCalledWith(createError(404, 'Charging station not found'))
})

test('updateStation error: update charging zone not prisma error', async () => {
  req.body = {
    latitudeStart: 1,
    longitudeStart: 2,
    latitudeEnd: 3,
    longitudeEnd: 4
  }
  req.db.chargingStation.update.mockRejectedValue(new Error())

  getControllerMethod(chargingStationController.updateStation)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(next).toHaveBeenCalledWith(new Error())
})

test('deleteStation error: delete charging zone not found', async () => {
  req.db.chargingStation.delete.mockRejectedValue(new PrismaClientKnownRequestError('test', 'P2025'))

  getControllerMethod(chargingStationController.deleteStation)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(next).toHaveBeenCalledWith(createError(404, 'Charging station not found'))
})

test('deleteStation error: delete charging zone not prisma error', async () => {
  req.db.chargingStation.delete.mockRejectedValue(new Error())

  getControllerMethod(chargingStationController.deleteStation)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(next).toHaveBeenCalledWith(new Error())
})
