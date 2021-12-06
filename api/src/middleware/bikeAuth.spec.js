const { prismaMock } = require('../utils/mockPrisma')
const { createWaitableMock } = require('../utils/tests')

const { bikeAuth } = require('./bikeAuth')

let req
let res
let next
beforeEach(() => {
  req = {
    db: prismaMock,
    params: {},
    headers: {}
  }

  next = createWaitableMock()
})

test('bikeAuth middleware returns function', async () => {
  const middleware = bikeAuth()

  expect(typeof middleware).toBe('function')
})

test('bikeAuth middleware throws when unauthorized', async () => {
  const middleware = bikeAuth()

  middleware(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(next).toHaveBeenCalledWith(expect.any(Error))
})

test('bikeAuth middleware throws when bearer token is incorrect', async () => {
  const middleware = bikeAuth()

  req.headers.authorization = 'Bearer 123'

  middleware(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(next).toHaveBeenCalledWith(expect.any(Error))
})

test('bikeAuth middleware passes when bearer token is correct', async () => {
  req.db.bike.findFirst.mockResolvedValue({ token: '123' })

  const middleware = bikeAuth()

  req.headers.authorization = 'Bearer 123'

  middleware(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(next).toHaveBeenCalledWith()
})

test('bikeAuth middleware respects url param', async () => {
  const middleware = bikeAuth()

  req.params.id = 'a'
  req.headers.authorization = 'Bearer 123'

  middleware(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.bike.findFirst).toHaveBeenCalledWith(expect.objectContaining({
    where: expect.objectContaining({
      id: req.params.id
    })
  }))
})
