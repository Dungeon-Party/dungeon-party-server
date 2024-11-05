import { Injectable } from '@nestjs/common'
import { ApiKey, Prisma } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

import { BaseCrudRepository } from '../utils/base.repository'

@Injectable()
export class ApiKeyRepository extends BaseCrudRepository<
  ApiKey,
  Prisma.ApiKeyFindFirstArgs,
  Prisma.ApiKeyFindUniqueArgs,
  Prisma.ApiKeyFindManyArgs,
  Prisma.ApiKeyGroupByArgs,
  Prisma.ApiKeyAggregateArgs,
  Prisma.ApiKeyCreateArgs,
  Prisma.ApiKeyCreateManyArgs,
  Prisma.ApiKeyUpdateArgs,
  Prisma.ApiKeyUpdateManyArgs,
  Prisma.ApiKeyDeleteArgs,
  Prisma.ApiKeyDeleteManyArgs
> {
  constructor(private readonly db: PrismaService) {
    super(db)
  }
}
