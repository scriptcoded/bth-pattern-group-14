const bike = require('./bike')

test('generateBikeID returns 5 character ID', async () => {
  expect(bike.generateBikeID()).toHaveLength(5)
})

test('generateBikeID returns unique ID', async () => {
  const a = bike.generateBikeID()
  const b = bike.generateBikeID()

  expect(a).not.toEqual(b)
})
