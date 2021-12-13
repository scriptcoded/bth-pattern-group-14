const { auth } = require('./auth')

let req
let res
let next
beforeEach(() => {
  req = {
    isUnauthenticated: () => false,
    user: {
      role: 'USER'
    }
  }

  next = jest.fn()
})

test('auth middleware returns function', async () => {
  const middleware = auth()

  expect(typeof middleware).toBe('function')
})

test('auth middleware throws when unauthorized', async () => {
  const middleware = auth()

  req.isUnauthenticated = () => true

  middleware(req, res, next)

  expect(next).toHaveBeenCalledWith(expect.any(Error))
})

test('auth middleware throws when user has incorrect role', async () => {
  const middleware = auth('ADMIN')

  middleware(req, res, next)

  expect(next).toHaveBeenCalledWith(expect.any(Error))
})

test('auth middleware passes when authorized', async () => {
  const middleware = auth()

  middleware(req, res, next)

  expect(next).toHaveBeenCalledWith()
})

test('auth middleware passes when user has correct role', async () => {
  const middleware = auth('USER')

  middleware(req, res, next)

  expect(next).toHaveBeenCalledWith()
})
