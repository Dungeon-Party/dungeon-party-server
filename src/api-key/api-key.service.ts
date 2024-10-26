import { Injectable } from '@nestjs/common';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import crypto from 'crypto'
import * as argon2 from 'argon2'
import { UserEntity } from '../users/entities/user.entity';
import { ApiKeyEntity } from './entities/api-key.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class ApiKeyService {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  async create(createApiKeyDto: CreateApiKeyDto): Promise<ApiKeyEntity> {
    const apiKeyPrefix = crypto.randomBytes(10).toString('hex')
    const apiKeyString = crypto.randomBytes(16).toString('hex')
    const apiKeyStringHashed = await argon2.hash(apiKeyString, {
      type: argon2.argon2i,
    })
    const apiKeyRaw = `dp-${apiKeyPrefix}.${apiKeyString}`
    const apiKeyHashed = `dp-${apiKeyPrefix}.${apiKeyStringHashed}`
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 7)

    return this.prismaService.apiKey
      .create({
        data: {
          name: createApiKeyDto.name,
          key: apiKeyHashed,
          expiresAt: expirationDate.toISOString(),
          userId: createApiKeyDto.userId,
        },
      })
      .then((apiKey) => {
        return {
          ...apiKey,
          key: apiKeyRaw,
        }
      })
  }

  async remove(ApiKeyWhereUniqueInput: Prisma.ApiKeyWhereUniqueInput) {
    return this.prismaService.apiKey.delete({
      where: ApiKeyWhereUniqueInput,
    })
  }

  async findValidApiKey(key: string): Promise<Partial<UserEntity> | null> {
    const keyPrefix = key.split('.')[0]
    return this.prismaService.apiKey
      .findFirst({
        where: {
          key: { startsWith: keyPrefix },
          expiresAt: { gt: new Date() },
        },
        select: {
          key: true,
          user: {
            select: {
              name: true,
              username: true,
              email: true,
            },
          },
        },
      })
      .then((apiKey) => {
        if (apiKey) {
          const apiKeyToVerify = apiKey.key.split('.')[1]
          if (argon2.verify(apiKeyToVerify, key)) {
            return new UserEntity(apiKey.user)
          }
        }
        return null
      })
  }
}
