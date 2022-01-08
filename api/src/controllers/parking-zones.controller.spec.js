const { prismaMock } = require('../utils/tests/mockPrisma')
const { createWaitableMock, getControllerMethod } = require('../utils/tests/tests')

const parkingZoneController = require('./parking-zones.controller')

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

test('getAllParkingZones returns correct parking zones', async () => {
  req.db.parkingZone.findMany.mockResolvedValue(mockZones)

  getControllerMethod(parkingZoneController.getAllParkingZones)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockZones })
})

test('getOneParkingZone respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(parkingZoneController.getOneParkingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.parkingZone.findUnique).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('getOneParkingZone returns correct parking zone', async () => {
  req.db.parkingZone.findUnique.mockResolvedValue(mockZones[0])
  req.params.id = 'a'

  getControllerMethod(parkingZoneController.getOneParkingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockZones[0] })
})

test('updateParkingZone respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(parkingZoneController.updateParkingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.parkingZone.update).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('updateParkingZone modifies parking zone', async () => {
  req.body = {
    name: 'steve'
  }

  getControllerMethod(parkingZoneController.updateParkingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.parkingZone.update).toHaveBeenCalledWith(expect.objectContaining({
    data: {
      name: req.body.name
    }
  }))
})

test('updateParkingZone returns updated parking zone', async () => {
  req.body = {
    name: 'steve'
  }
  req.db.parkingZone.update.mockResolvedValue(req.body)

  getControllerMethod(parkingZoneController.updateParkingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: req.body })
})

test('deleteParkingZone respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(parkingZoneController.deleteParkingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.parkingZone.delete).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('deleteParkingZone returns deleted parking zone', async () => {
  req.db.parkingZone.delete.mockResolvedValue(mockZones[0])

  getControllerMethod(parkingZoneController.deleteParkingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockZones[0] })
})
