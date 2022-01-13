const passport = require('passport')

const { prismaMock } = require('../utils/tests/mockPrisma')
const { createWaitableMock, getControllerMethod } = require('../utils/tests/tests')

const authController = require('./auth.controller')

let req
let res
let next
beforeEach(() => {
  req = {
    logout: jest.fn(),
    db: prismaMock,
    params: {}
  }

  res = {
    json: jest.fn()
  }

  next = createWaitableMock()
})

test('getCurrentUser returns user', async () => {
  req.body = { amount: 1000 }
  req.user = {
    id: 'a'
  }

  getControllerMethod(authController.getCurrentUser)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    data: req.user
  }))
})

// test('githubCallback returns correct amount topped up', async () => {
//   const mockAnswer = {}
//   req.body = { amount: 1000 }
//   req.user = {
//     id: 'a'
//   }

//   jest.spyOn(passport, 'authenticate').mockResolvedValue(mockAnswer)

//   getControllerMethod(authController.githubCallback)(req, res, next)
//   await next.waitToHaveBeenCalled()

//   expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
//     data: req.user
//   }))
// })

test('Logout works correctly', async () => {
  const mockAnswer = true

  req.logout.mockResolvedValue(mockAnswer)
  // jest.spyOn(req, 'logout').mockResolvedValue(mockAnswer)

  getControllerMethod(authController.logout)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.logout).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({})
})
