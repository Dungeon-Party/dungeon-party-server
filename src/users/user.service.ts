import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import * as argon2 from 'argon2'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}

  async findOne(userWhereInput: Prisma.UserWhereInput): Promise<User | null> {
    return this.db.user.findFirst({ where: userWhereInput })
  }

  async findAll(params: {
    skip?: number
    take?: number
    cursor?: Prisma.UserWhereUniqueInput
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.db.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    data.password = await argon2.hash(data.password, { type: argon2.argon2i })
    return this.db.user.create({
      data,
    })
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }): Promise<User> {
    const { where, data } = params
    return this.db.user.update({
      data,
      where,
    })
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.db.user.delete({
      where,
    })
  }
}
