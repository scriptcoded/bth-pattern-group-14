const { mockDeep, mockReset } = require('jest-mock-extended')

const { prisma } = require('../prisma')

jest.mock('../prisma', () => {
  const originalModule = jest.requireActual('../prisma')

  return {
    __esModule: true,
    ...originalModule,
    prisma: mockDeep()
  }
})

beforeEach(() => {
  mockReset(module.exports.prismaMock)
})

module.exports.prismaMock = prisma
