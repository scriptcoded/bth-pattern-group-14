const createError = require('http-errors')
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime')

const { prismaMock } = require('../utils/tests/mockPrisma')
const { createWaitableMock, getControllerMethod } = require('../utils/tests/tests')

const applicationController = require('./application.controller')

const mockApplication = [
  {
    id: 'a',
    name: 'test1',
    token: 'token1'
  },
  {
    id: 'b',
    name: 'test2',
    token: 'token2'
  }
]

let req
let res
let next
beforeEach(() => {
  req = {
    db: prismaMock,
    params: {},
    user: {}
  }

  res = {
    json: jest.fn()
  }

  next = createWaitableMock()
})

test('getAllApplications returns correct applications', async () => {
  req.db.applications.findMany.mockResolvedValue(mockApplication)

  getControllerMethod(applicationController.getAllApplications)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockApplication })
})

test('getOneApplication respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(applicationController.getOneApplication)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.applications.findUnique).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('getOneApplication returns correct application', async () => {
  req.db.applications.findUnique.mockResolvedValue(mockApplication[0])
  req.params.id = 'a'

  getControllerMethod(applicationController.getOneApplication)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockApplication[0] })
})

test('updateApplication respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(applicationController.updateApplication)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.applications.update).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('updateApplication modifies application', async () => {
  req.body = {
    name: 'Igor'
  }

  getControllerMethod(applicationController.updateApplication)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.applications.update).toHaveBeenCalledWith(expect.objectContaining({
    data: {
      name: req.body.name
    }
  }))
})

test('updateApplication returns updated application', async () => {
  req.body = {
    name: 'Igor'
  }
  req.db.applications.update.mockResolvedValue(req.body)

  getControllerMethod(applicationController.updateApplication)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: req.body })
})

test('deleteApplication respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(applicationController.deleteApplication)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.applications.delete).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('deleteApplication returns deleted Application', async () => {
  req.db.applications.delete.mockResolvedValue(mockApplication[0])

  getControllerMethod(applicationController.deleteApplication)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockApplication[0] })
})

test('createApplication returns created Application', async () => {
  req.body = {
    name: 'App 1'
  }
  req.db.applications.create.mockResolvedValue(mockApplication[0])

  getControllerMethod(applicationController.createApplication)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockApplication[0] })
})

test('application error: delete application not found', async () => {
  req.body = {
    name: 'App 1'
  }
  req.db.applications.delete.mockRejectedValue(new PrismaClientKnownRequestError('test', 'P2025'))

  getControllerMethod(applicationController.deleteApplication)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(next).toHaveBeenCalledWith(createError(404, 'Application not found'))
})

test('application error: delete not prisma error', async () => {
  req.body = {
    name: 'App 1'
  }
  req.db.applications.delete.mockRejectedValue(new Error())

  getControllerMethod(applicationController.deleteApplication)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(next).toHaveBeenCalledWith(new Error())
})

test('application error: update application not found', async () => {
  req.body = {
    name: 'App 1'
  }
  req.db.applications.update.mockRejectedValue(new PrismaClientKnownRequestError('test', 'P2025'))

  getControllerMethod(applicationController.updateApplication)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(next).toHaveBeenCalledWith(createError(404, 'Application not found'))
})

test('application error: update not prisma error', async () => {
  req.body = {
    name: 'App 1'
  }
  req.db.applications.update.mockRejectedValue(new Error())

  getControllerMethod(applicationController.updateApplication)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(next).toHaveBeenCalledWith(new Error())
})
