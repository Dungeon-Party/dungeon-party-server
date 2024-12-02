import * as argon2 from 'argon2'

const users = [
  {
    id: 1,
    name: 'Admin',
    username: 'admin',
    role: 'ADMIN',
    email: 'admin@prisma.io',
    password: 'password',
  },
  {
    id: 2,
    name: 'User',
    username: 'user',
    role: 'USER',
    email: 'user@prisma.io',
    password: 'password',
  },
]

export default async () => {
  for (const user of users) {
    user.password = await argon2.hash(user.password, { type: argon2.argon2i })
  }

  return users
}
