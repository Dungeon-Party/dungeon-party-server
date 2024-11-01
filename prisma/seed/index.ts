import { PrismaClient } from '@prisma/client'

import data from './data/'

const prisma = new PrismaClient()

const runSeeders = async () => {
  for (const [key, valueFunction] of Object.entries(data)) {
    console.log(`Seeding ${key}...`)
    const value = await valueFunction()
    await Promise.all(
      value.map(async (item) => {
        return prisma[key].upsert({
          where: { id: item.id },
          update: item,
          create: item,
        })
      }),
    ).catch((e) => {
      console.error(`Error seeding ${key}: ${e}`)
      process.exit(1)
    })
  }
}

runSeeders().finally(async () => {
  console.log('Successfully seeded database. Closing connection.')
  await prisma.$disconnect()
})
