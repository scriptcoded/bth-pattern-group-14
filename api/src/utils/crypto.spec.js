const crypto = require('./crypto')

test('generateToken returns double length token', async () => {
  const token = await crypto.generateToken(48)
  expect(token).toHaveLength(48 * 2)
})

test('generateToken returns unique value', async () => {
  const a = await crypto.generateToken()
  const b = await crypto.generateToken()

  expect(a).not.toEqual(b)
})
