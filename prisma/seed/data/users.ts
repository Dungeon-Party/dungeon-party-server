import { Role } from '@prisma/client'
import * as argon2 from 'argon2'

const users = [
  {
    id: 1,
    name: 'Admin',
    username: 'admin',
    role: Role.ADMIN,
    email: 'admin@dungeon-party.io',
    password: 'password',
  },
]

export default async () => {
  for (const user of users) {
    user.password = await argon2.hash(user.password, { type: argon2.argon2i })
  }

  return users
}
