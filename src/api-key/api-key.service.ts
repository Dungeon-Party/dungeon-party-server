import * as crypto from 'crypto'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as argon2 from 'argon2'
import { PrismaService } from 'nestjs-prisma'

import { UserEntity } from '../user/entities/user.entity'
import { CreateApiKeyDto } from './dto/create-api-key.dto'
import { ApiKeyEntity } from './entities/api-key.entity'

@Injectable()
export class ApiKeyService {
  constructor(private readonly db: PrismaService) {}

  async create(
    createApiKeyDto: CreateApiKeyDto,
    userId: UserEntity['id'],
  ): Promise<ApiKeyEntity> {
    const apiKeyPrefix = crypto.randomBytes(10).toString('hex')
    const apiKeyString = crypto.randomBytes(16).toString('hex')
    const apiKeyStringHashed = await argon2.hash(apiKeyString, {
      type: argon2.argon2i,
    })
    const apiKeyRaw = `dp-${apiKeyPrefix}.${apiKeyString}`
    const apiKeyHashed = `dp-${apiKeyPrefix}.${apiKeyStringHashed}`
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 7)

    return this.db.apiKey
      .create({
        data: {
          name: createApiKeyDto.name,
          key: apiKeyHashed,
          expiresAt: expirationDate.toISOString(),
          userId: userId,
        },
      })
      .then((apiKey) => {
        return new ApiKeyEntity({
          ...apiKey,
          key: apiKeyRaw,
        })
      })
  }

  async delete(
    ApiKeyWhereUniqueInput: Prisma.ApiKeyWhereUniqueInput,
  ): Promise<ApiKeyEntity | null> {
    return this.db.apiKey
      .delete({
        where: ApiKeyWhereUniqueInput,
      })
      .then((apiKey) => {
        return new ApiKeyEntity(apiKey)
      })
  }

  async findOne(key: string): Promise<Partial<ApiKeyEntity> | null> {
    const keyPrefix = key.split('.')[0]
    return this.db.apiKey.findFirst({
      where: {
        key: { startsWith: keyPrefix },
        expiresAt: { gt: new Date() },
      },
    })
  }
}
