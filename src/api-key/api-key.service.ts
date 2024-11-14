// TODO: Inject logger and log any exceptions
// TODO: add JsDoc comments to all methods
// TODO: Ensure that all method names make sense (getAllApiKeysForUser vs getAllApiKeys)
import * as crypto from 'crypto'
import { Injectable, NotFoundException } from '@nestjs/common'
import * as argon2 from 'argon2'

import { User as UserEntity } from '../user/entities/user.entity'
import { ApiKeyRepository } from './api-key.repository'
import { CreateApiKeyResponseDto } from './dto/create-api-key-response.dto'
import { CreateApiKeyDto } from './dto/create-apiKey.dto'
import { ApiKey } from './entities/api-key.entity'

@Injectable()
export class ApiKeyService {
  constructor(private readonly repo: ApiKeyRepository) {}

  async createApiKey(
    userId: UserEntity['id'],
    createApiKeyDto: CreateApiKeyDto,
  ): Promise<CreateApiKeyResponseDto> {
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
        return new CreateApiKeyResponseDto({
          ...apiKey,
          key: apiKeyRaw,
        })
      })
  }

  async deleteApiKey(
    userId: UserEntity['id'],
    apiKeyId: ApiKey['id'],
  ): Promise<ApiKey> {
    return this.repo
      .delete({
        where: { id: apiKeyId, userId: userId },
      })
      .then((apiKey) => {
        return new ApiKey(apiKey)
      })
  }

  async getAllApiKeys(user: UserEntity): Promise<ApiKey[]> {
    return this.repo
      .findMany({
        where: { userId: user.id },
      })
      .then((apiKeys) => {
        return apiKeys.map((apiKey) => new ApiKey(apiKey))
      })
  }

  async findApiKeyById(apiKeyId: ApiKey['id']): Promise<ApiKey> {
    return this.repo.findFirst({ where: { id: apiKeyId } }).then((apiKey) => {
      if (!apiKey) {
        throw new NotFoundException('API key not found')
      }
      return new ApiKey(apiKey)
    })
  }

  async findValidApiKey(key: string): Promise<ApiKey> {
    const keyPrefix = key.split('.')[0]
    return this.repo
      .findFirst({
        where: {
          key: { startsWith: keyPrefix },
          expiresAt: { gt: new Date() },
        },
      })
      .then((apiKey) => {
        if (!apiKey) {
          throw new NotFoundException('API key not found')
        }
        return new ApiKey(apiKey)
      })
  }
}
