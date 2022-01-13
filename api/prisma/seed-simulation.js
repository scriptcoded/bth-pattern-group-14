const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const bikeCount = 50 + 200 + 200 + 400 + 50

const userCount = 1000

function randomFloat (min, max) {
  return (Math.random() * (min - max) + max).toFixed(6)
}

function randomInt (min, max) {
  return Math.round(randomFloat(min, max))
}

async function seed () {
  for (let i = 0; i < bikeCount; i++) {
    await prisma.bike.create({
      data: {
        id: 'S' + i.toString().padStart(4, '0'),
        latitude: 0,
        longitude: 0,
        battery: randomInt(70, 100),
        speed: 0,
        token: 'x'
      }
    })
  }

  for (let i = 0; i < userCount; i++) {
    const paddedIndex = i.toString().padStart(4, '0')

    await prisma.user.create({
      data: {
        id: 'S' + paddedIndex,
        email: `user${paddedIndex}@example.com`,
        githubId: `dummy_${paddedIndex}`,
        name: `User ${paddedIndex}`,
        balance: Math.floor(Math.random() * (100 + 1))
      }
    })
  }
}

seed()
  .catch(e => console.error('Seeding failed:', e))
