const { prismaMock } = require('../utils/mockPrisma')
const { createWaitableMock } = require('../utils/tests')

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
    db: prismaMock
  }

  res = {
    json: jest.fn()
  }

  next = createWaitableMock()
})

test('getAllUsers returns correct users', async () => {
  req.db.user.findMany.mockResolvedValue(mockUsers)

  userController.getAllUsers(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockUsers })
})
