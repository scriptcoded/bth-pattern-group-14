const { prismaMock } = require('../utils/tests/mockPrisma')
const { createWaitableMock, getControllerMethod } = require('../utils/tests/tests')

const authController = require('./auth.controller')

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

test('getCurrentUser returns correct amount topped up', async () => {
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
