const { prismaMock } = require('../utils/tests/mockPrisma')
const { createWaitableMock, getControllerMethod } = require('../utils/tests/tests')

const drivingZoneController = require('./driving-zones.controller')

const mockZones = [
  {
    id: 'a',
    latitudeStart: 1,
    longitudeStart: 2,
    latitudeEnd: 3,
    longitudeEnd: 4
  },
  {
    id: 'b',
    latitudeStart: 5,
    longitudeStart: 6,
    latitudeEnd: 7,
    longitudeEnd: 8
  }
]

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

test('getAllDrivingZones returns correct driving zones', async () => {
  req.db.drivingZone.findMany.mockResolvedValue(mockZones)

  getControllerMethod(drivingZoneController.getAllDrivingZones)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockZones })
})

test('getOneDrivingZone respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(drivingZoneController.getOneDrivingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.drivingZone.findUnique).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('getOneDrivingZone returns correct driving zone', async () => {
  req.db.drivingZone.findUnique.mockResolvedValue(mockZones[0])
  req.params.id = 'a'

  getControllerMethod(drivingZoneController.getOneDrivingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockZones[0] })
})

test('updateDrivingZone respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(drivingZoneController.updateDrivingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.drivingZone.update).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('updateDrivingZone modifies driving zone', async () => {
  req.body = {
    name: 'a'
  }

  getControllerMethod(drivingZoneController.updateDrivingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.drivingZone.update).toHaveBeenCalledWith(expect.objectContaining({
    data: {
      name: req.body.name
    }
  }))
})

test('updateDrivingZone returns updated driving zone', async () => {
  req.body = {
    name: 'steve'
  }
  req.db.drivingZone.update.mockResolvedValue(req.body)

  getControllerMethod(drivingZoneController.updateDrivingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: req.body })
})

// test('updateDrivingZone without id', async () => {
//   req.body = {
//     id: null
//   }
//   req.db.drivingZone.update.mockResolvedValue(req.body)

//   req.params.id = null
//   getControllerMethod(drivingZoneController.updateDrivingZone)(req, res, next)
//   await next.waitToHaveBeenCalled()

//   // console.log(expect(res.json))

//   expect(res.json).toHaveBeenCalledWith({ data: req.body })
// })

// test('bad error', async () => {
//   req.body = {
//     name: 'steve'
//   }
//   req.db.drivingZone.update.mockResolvedValue(req.body)

//   getControllerMethod(drivingZoneController.updateDrivingZone)(req, res, next)
//   await next.waitToHaveBeenCalled()

//   // expect(res.json).toHaveBeenCalledWith({ data: req.body })
//   const t = () => {
//     throw new createError()
//   }
//   expect(t).toThrow(createError)
// })

test('createDrivingZone', async () => {
  req.body = {
    name: 'c',
    latitudeStart: 1,
    longitudeStart: 2,
    latitudeEnd: 3,
    longitudeEnd: 4
  }
  req.db.drivingZone.create.mockResolvedValue(req.body)

  getControllerMethod(drivingZoneController.createDrivingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: req.body })
})

// test('createDrivingZone with no value', async () => {
//   req.body = {}
//   req.db.drivingZone.create.mockResolvedValue(req.body)

//   getControllerMethod(drivingZoneController.createDrivingZone)(req, res, next)
//   await next.waitToHaveBeenCalled()

//   expect(res.json).toHaveBeenCalledWith({ data: req.body })
// })

test('deleteDrivingZone respects url param', async () => {
  req.params.id = 'a'

  getControllerMethod(drivingZoneController.deleteDrivingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(req.db.drivingZone.delete).toHaveBeenCalledWith(expect.objectContaining({
    where: {
      id: req.params.id
    }
  }))
})

test('deleteDrivingZone returns deleted driving zone', async () => {
  req.db.drivingZone.delete.mockResolvedValue(mockZones[0])

  getControllerMethod(drivingZoneController.deleteDrivingZone)(req, res, next)
  await next.waitToHaveBeenCalled()

  expect(res.json).toHaveBeenCalledWith({ data: mockZones[0] })
})
