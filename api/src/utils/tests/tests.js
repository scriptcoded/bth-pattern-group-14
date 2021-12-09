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

/**
 * If the handler is an array the last function is returned, otherwise the
 * handler itself is returned.
 * @param {*} handler Handler function or array of handler functions
 * @returns Single handler function
 */
module.exports.getControllerMethod = (handler) => {
  if (Array.isArray(handler)) {
    return handler[handler.length - 1]
  } else {
    return handler
  }
}
