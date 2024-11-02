import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as argon2 from 'argon2'
import { PrismaService } from 'nestjs-prisma'

import { UserEntity } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(private db: PrismaService) {}

  async findOne(
    userWhereInput: Prisma.UserWhereInput,
  ): Promise<UserEntity | null> {
    return this.db.user.findFirst({ where: userWhereInput })
  }

  async findAll(params: {
    skip?: number
    take?: number
    cursor?: Prisma.UserWhereUniqueInput
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<UserEntity[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.db.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async create(data: Prisma.UserCreateInput): Promise<UserEntity> {
    data.password = await argon2.hash(data.password, { type: argon2.argon2i })
    return this.db.user.create({
      data,
    })
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }): Promise<UserEntity> {
    const { where, data } = params
    return this.db.user.update({
      data,
      where,
    })
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<UserEntity> {
    return this.db.user.delete({
      where,
    })
  }
}
