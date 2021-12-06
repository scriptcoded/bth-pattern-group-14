const { validate } = require('./validate')

let req
let res
let next
beforeEach(() => {
  req = { }

  next = jest.fn()
})

test('validate middleware returns function', async () => {
  const middleware = validate()

  expect(typeof middleware).toBe('function')
})

// TODO: Create validation test suite
