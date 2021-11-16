const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seed () {
  // Add seeding functionality here
}

seed()
  .catch(e => console.error('Seeding failed:', e))
