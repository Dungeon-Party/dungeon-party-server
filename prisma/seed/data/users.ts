import { genSaltSync, hashSync } from 'bcryptjs'

const salt = genSaltSync(10)

const users = [
  {
    id: 1,
    name: 'Rick',
    username: 'rick',
    email: 'rick@prisma.io',
    password: 'password',
  },
]

export default async () => {
  return users.map((user) => {
    return {
      ...user,
      password: hashSync(user.password, salt),
    }
  })
}  