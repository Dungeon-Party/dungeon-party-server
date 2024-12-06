// TODO: Inject logger and log any exceptions
// TODO: add JsDoc comments to all methods
// TODO: Ensure that all method names make sense (getAllApiKeysForUser vs getAllApiKeys)
import * as crypto from 'crypto'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Prisma } from '@prisma/client'
import * as argon2 from 'argon2'

import { User } from '../user/entities/user.entity'
import { ApiKeyRepository } from './api-key.repository'
import { CreateApiKeyResponseDto } from './dto/create-api-key-response.dto'
import { CreateApiKeyDto } from './dto/create-api-key.dto'
import { GetApiKeyParamsDto } from './dto/get-api-key-params.dto'
import { ApiKey } from './entities/api-key.entity'

@Injectable()
export class ApiKeyService {
  private readonly logger: Logger = new Logger(ApiKeyService.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly repo: ApiKeyRepository,
  ) {}

  async create(
    createApiKeyDto: CreateApiKeyDto,
  ): Promise<CreateApiKeyResponseDto> {
    const apiKeyIdPrefix = this.configService.get<string>(
      'security.apiKey.prefix',
    )
    const apiKeyExpirationLength = this.configService.get<number>(
      'security.apiKey.expirationLength',
    )
    const apiKeyPrefix = crypto.randomBytes(10).toString('hex')
    const apiKeyString = crypto.randomBytes(16).toString('hex')
    const apiKeyStringHashed = await argon2.hash(apiKeyString, {
      type: argon2.argon2i,
    })
    const apiKeyRaw = `${apiKeyIdPrefix}-${apiKeyPrefix}.${apiKeyString}`
    const apiKeyHashed = `${apiKeyIdPrefix}-${apiKeyPrefix}.${apiKeyStringHashed}`
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + apiKeyExpirationLength)

    return this.repo
      .create({
        data: {
          name: createApiKeyDto.name,
          key: apiKeyHashed,
          expiresAt: expirationDate.toISOString(),
          user: { connect: { id: createApiKeyDto.userId } },
        },
      })
      .then((apiKey) => {
        return new CreateApiKeyResponseDto({
          ...apiKey,
          key: apiKeyRaw,
        })
      })
  }

  async delete(userId: User['id'], apiKeyId: ApiKey['id']): Promise<ApiKey> {
    return this.repo
      .delete({
        where: { id: apiKeyId, userId: userId },
      })
      .then((apiKey) => {
        if (!apiKey) {
          throw new NotFoundException('API key not found')
        }
        return new ApiKey(apiKey)
      })
  }

  async getAll(query?: Prisma.ApiKeyWhereInput): Promise<ApiKey[]> {
    const params: Prisma.ApiKeyFindManyArgs =
      GetApiKeyParamsDto.buildParams(query)

    return this.repo.findMany(params).then((apiKeys) => {
      return apiKeys.map((apiKey) => new ApiKey(apiKey))
    })
  }

  async getById(apiKeyId: ApiKey['id']): Promise<ApiKey> {
    return this.repo.findFirst({ where: { id: apiKeyId } }).then((apiKey) => {
      if (!apiKey) {
        throw new NotFoundException('API key not found')
      }
      return new ApiKey(apiKey)
    })
  }

  async getValid(key: string): Promise<ApiKey> {
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
