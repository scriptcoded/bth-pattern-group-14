const { mockDeep, mockReset } = require('jest-mock-extended')

const { prisma } = require('../prisma')

jest.mock('./prisma', () => ({
  __esModule: true,
  prisma: mockDeep()
}))

beforeEach(() => {
  mockReset(module.exports.prismaMock)
})

module.exports.prismaMock = prisma
