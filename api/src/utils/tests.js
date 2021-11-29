/**
 * Creates a mock function that can be waited on
 */
module.exports.createWaitableMock = () => {
  let resolve
  let times
  let calledCount = 0
  const mock = jest.fn()
  mock.mockImplementation(() => {
    calledCount += 1
    if (resolve && calledCount >= times) {
      resolve()
    }
  })

  mock.waitToHaveBeenCalled = (t = 1) => {
    times = t
    // eslint-disable-next-line promise/param-names
    return new Promise(r => {
      resolve = r
    })
  }

  return mock
}
