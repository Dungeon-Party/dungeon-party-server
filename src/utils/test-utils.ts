/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanActivate } from '@nestjs/common'
import { ApiKey, User } from '@prisma/client'
import { faker } from '@faker-js/faker'

import { UserEntity } from '../user/entities/user.entity'

/**
 * Checks whether a route or a Controller is protected with the specified Guard.
 * @param route is the route or Controller to be checked for the Guard.
 * @param guardType is the type of the Guard, e.g. JwtAuthGuard.
 * @returns true if the specified Guard is applied.
 */
export const isGuarded = (
  route: ((...args: any[]) => any) | (new (...args: any[]) => unknown),
  guardType: new (...args: any[]) => CanActivate,
) => {
  const guards: any[] = Reflect.getMetadata('__guards__', route)

  if (!guards) {
    throw Error(
      `Expected: ${route.name} to be protected with ${guardType.name}\nReceived: No guard`,
    )
  }

  let foundGuard = false
  const guardList: string[] = []
  guards.forEach((guard) => {
    guardList.push(guard.name)
    if (guard.name === guardType.name) foundGuard = true
  })

  if (!foundGuard) {
    throw Error(
      `Expected: ${route.name} to be protected with ${guardType.name}\nReceived: only ${guardList}`,
    )
  }
  return true
}

export const getUser = (): UserEntity => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    id: faker.number.int(),
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({
      firstName,
      lastName,
    }),
    username: faker.internet.username({
      firstName,
      lastName,
    }),
    role: faker.helpers.arrayElement(['ADMIN', 'USER']),
    password: faker.internet.password(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  } as User
}

export const getApiKey = () => {
  return {
    id: faker.number.int(),
    name: faker.lorem.word(),
    key: `dp-${faker.string.alphanumeric({ length: 20 })}.${faker.string.alphanumeric({ length: 32 })}`,
    userId: faker.number.int(),
    expiresAt: faker.date.future(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  } as ApiKey
}
