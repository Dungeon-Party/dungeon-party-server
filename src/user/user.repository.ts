import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

import { BaseCrudRepository } from '../utils/base.repository'

@Injectable()
export class UserRepository extends BaseCrudRepository<
  User,
  Prisma.UserFindFirstArgs,
  Prisma.UserFindUniqueArgs,
  Prisma.UserFindManyArgs,
  Prisma.UserGroupByArgs,
  Prisma.UserAggregateArgs,
  Prisma.UserCreateArgs,
  Prisma.UserCreateManyArgs,
  Prisma.UserUpdateArgs,
  Prisma.UserUpdateManyArgs,
  Prisma.UserDeleteArgs,
  Prisma.UserDeleteManyArgs
> {
  constructor(private readonly db: PrismaService) {
    super(db)
  }
}
