import * as crypto from 'crypto'
import { Injectable } from '@nestjs/common'
import * as argon2 from 'argon2'

import { UserEntity } from '../user/entities/user.entity'
import { ApiKeyRepository } from './api-key.repository'
import { CreateApiKeyDto } from './dto/create-api-key.dto'
import { ApiKeyEntity } from './entities/api-key.entity'

@Injectable()
export class ApiKeyService {
  constructor(private readonly repo: ApiKeyRepository) {}

  async createApiKey(
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

    return this.repo
      .create({
        data: {
          name: createApiKeyDto.name,
          key: apiKeyHashed,
          expiresAt: expirationDate.toISOString(),
          user: { connect: { id: userId } },
        },
      })
      .then((apiKey) => {
        return new ApiKeyEntity({
          ...apiKey,
          key: apiKeyRaw,
        })
      })
  }

  async deleteApiKey(
    apiKeyId: ApiKeyEntity['id'],
    userId: UserEntity['id'],
  ): Promise<ApiKeyEntity> {
    return this.repo
      .delete({
        where: { id: apiKeyId, userId: userId },
      })
      .then((apiKey) => {
        return new ApiKeyEntity(apiKey)
      })
  }

  async findValidApiKey(key: string): Promise<ApiKeyEntity> {
    const keyPrefix = key.split('.')[0]
    return this.repo
      .findFirst({
        where: {
          key: { startsWith: keyPrefix },
          expiresAt: { gt: new Date() },
        },
      })
      .then((apiKey) => {
        return new ApiKeyEntity(apiKey)
      })
  }
}
