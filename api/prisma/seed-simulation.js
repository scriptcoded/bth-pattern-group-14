const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const zones = [
  {
    bikeCount: 50,
    fenceStart: [55.607457, 12.975199],
    fenceEnd: [55.558648, 13.055093]
  },
  {
    bikeCount: 200,
    fenceStart: [55.730383, 13.156146],
    fenceEnd: [55.692376, 13.234241]
  },
  {
    bikeCount: 200,
    fenceStart: [56.223860, 15.612477],
    fenceEnd: [56.194692, 15.661401]
  },
  {
    bikeCount: 400,
    fenceStart: [59.490462, 17.818657],
    fenceEnd: [59.218775, 18.228153]
  },
  {
    bikeCount: 50,
    fenceStart: [55.916021, 12.684624],
    fenceEnd: [55.902818, 12.711622]
  }
]

const userCount = 1000

function randomFloat (min, max) {
  return (Math.random() * (min - max) + max).toFixed(6)
}

function randomInt (min, max) {
  return Math.round(randomFloat(min, max))
}

async function seed () {
  let counter = 0
  for (const zone of zones) {
    for (let i = 0; i < zone.bikeCount; i++) {
      await prisma.bike.create({
        data: {
          id: 'S' + counter.toString().padStart(4, '0'),
          latitude: randomFloat(zone.fenceStart[0], zone.fenceEnd[0]),
          longitude: randomFloat(zone.fenceStart[1], zone.fenceEnd[1]),
          battery: randomInt(70, 100),
          speed: 0,
          token: 'x'
        }
      })

      counter += 1
    }
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
