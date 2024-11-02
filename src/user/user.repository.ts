import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class UserRepository {
  constructor(private readonly db: PrismaService) {}

  async createUser(params: { data: Prisma.UserCreateInput }): Promise<User> {
    const { data } = params
    return this.db.user.create({ data })
  }

  async getUser(params: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
    const { where } = params
    return this.db.user.findUnique({ where })
  }

  async getUsers(params: {
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

  async findUser(params: { where: Prisma.UserWhereInput }): Promise<User> {
    const { where } = params
    return this.db.user.findFirst({ where })
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }): Promise<User> {
    const { where, data } = params
    return this.db.user.update({ data, where })
  }

  async deleteUser(params: {
    where: Prisma.UserWhereUniqueInput
  }): Promise<User> {
    const { where } = params
    return this.db.user.delete({ where })
  }
}
