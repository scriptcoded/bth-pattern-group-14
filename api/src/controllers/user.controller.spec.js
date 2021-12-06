const { prismaMock } = require('../utils/mockPrisma')
const { createWaitableMock, getControllerMethod } = require('../utils/tests')

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
