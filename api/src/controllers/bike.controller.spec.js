const { prismaMock } = require('../utils/tests/mockPrisma')
const { createWaitableMock, getControllerMethod } = require('../utils/tests/tests')

const bikeController = require('./bike.controller')

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
