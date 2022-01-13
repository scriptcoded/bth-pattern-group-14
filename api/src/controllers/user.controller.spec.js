const { prismaMock } = require('../utils/tests/mockPrisma')
const { createWaitableMock, getControllerMethod } = require('../utils/tests/tests')

const userController = require('./user.controller')

const mockUsers = [
  {
    id: 'a',
    name: 'John'
  },
  {
    id: 'B',
    name: 'Jane'
  }
]

const mockRides = [
  {
    id: 'a',
    startTime: new Date(),
    endTime: new Date(),
    startLatitude: 1,
    startLongitude: 2,
    endLatitude: 3,
    endLongitude: 4,
    fromParkingZone: false,
    toParkingZone: false,
    bikeId: 'a',
    userId: mockUsers[0].id
  }
]

const mockPayments = [
  {
    userId: 'a',
    amount: 10,
    automatic: true,
    paid: true
  },
  {
    userId: 'B',
    amount: 2000,
    automatic: false,
    paid: false
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

test('getAllUsers returns correct users', async () => {
  req.db.user.findMany.mockResolvedValue(mockUsers)

  getControllerMethod(userController.getAllUsers)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockUsers })
})

test('getOneUser respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(userController.getOneUser)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.user.findUnique).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('getOneUser returns correct user', async () => {
  req.db.user.findUnique.mockResolvedValue(mockUsers[0])
  req.params.id = 'a'

  getControllerMethod(userController.getOneUser)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockUsers[0] })
})

test('updateUser respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(userController.updateUser)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.user.update).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('updateUser modifies user', async () => {
  req.body = {
    name: 'steve'
  }

  getControllerMethod(userController.updateUser)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.user.update).toHaveBeenCalledWith(expect.objectContaining({
    data: {
      name: req.body.name
    }
  }))
})

test('updateUser returns updated user', async () => {
  req.body = {
    name: 'steve'
  }
  req.db.user.update.mockResolvedValue(req.body)

  getControllerMethod(userController.updateUser)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: req.body })
})

test('getMyRides returns payments', async () => {
  req.db.ride.findMany.mockResolvedValue(mockRides[0])
  req.user = {
    id: 'a'
  }
  getControllerMethod(userController.getMyRides)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockRides[0] })
})

test('getMyPayments returns payments', async () => {
  req.db.payment.findMany.mockResolvedValue(mockPayments[0])
  req.user = {
    id: 'a'
  }
  getControllerMethod(userController.getMyPayments)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockPayments[0] })
})

test('deleteUser respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(userController.deleteUser)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.user.delete).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('deleteUser returns deleted user', async () => {
  req.db.user.delete.mockResolvedValue(mockUsers[0])

  getControllerMethod(userController.deleteUser)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockUsers[0] })
})
