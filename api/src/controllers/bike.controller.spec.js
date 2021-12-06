const { prismaMock } = require('../utils/tests/mockPrisma')
const { createWaitableMock, getControllerMethod } = require('../utils/tests/tests')

const bikeController = require('./bike.controller')

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

test('getAllBikes returns correct bikes', async () => {
  req.db.bike.findMany.mockResolvedValue(mockZones)

  getControllerMethod(bikeController.getAllBikes)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockZones })
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
  req.db.bike.findUnique.mockResolvedValue(mockZones[0])
  req.params.id = 'a'

  getControllerMethod(bikeController.getOneBike)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockZones[0] })
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
  req.db.bike.delete.mockResolvedValue(mockZones[0])

  getControllerMethod(bikeController.deleteBike)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockZones[0] })
})
