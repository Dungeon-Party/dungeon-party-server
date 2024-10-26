import * as crypto from 'crypto'
import { Test, TestingModule } from '@nestjs/testing'
import * as argon2 from 'argon2'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { PrismaService } from '../common/prisma/prisma.service'
import { ApiKeyService } from './api-key.service'
import { ApiKeyEntity } from './entities/api-key.entity'

describe('ApiKeyService', () => {
  let apiKeyService: ApiKeyService
  let prismaService: DeepMockProxy<PrismaService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiKeyService],
    })
      .useMocker(mockDeep)
      .compile()

    prismaService = module.get(PrismaService)
    apiKeyService = module.get(ApiKeyService)
  })

  describe('create', () => {
    it('should return the result of prismaService.apiKey.create method', async () => {
      const apiKeyPart = Buffer.from('kljsdf892hhlk3hkl')
      const result: ApiKeyEntity = {
        id: 1,
        name: 'test',
        key: 'should-not-returned',
        expiresAt: new Date(),
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      prismaService.apiKey.create.mockResolvedValueOnce(result)
      jest.spyOn(crypto, 'randomBytes').mockImplementation(() => {
        return apiKeyPart
      })
      jest
        .spyOn(argon2, 'hash')
        .mockResolvedValueOnce(apiKeyPart.toString('hex'))
      const createApiKeyDto = { name: 'test', userId: 1 }

      const apiKey = await apiKeyService.create(createApiKeyDto)
      expect(apiKey).toEqual({
        ...result,
        key: `dp-${apiKeyPart.toString('hex')}.${apiKeyPart.toString('hex')}`,
      })
    })
  })

  describe('remove', () => {
    it('should return the result of prismaService.apiKey.delete method', async () => {
      const result: ApiKeyEntity = {
        id: 1,
        name: 'test',
        key: 'should-not-returned',
        expiresAt: new Date(),
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      prismaService.apiKey.delete.mockResolvedValueOnce(result)
      const ApiKeyWhereUniqueInput = { id: 1 }

      const apiKey = await apiKeyService.remove(ApiKeyWhereUniqueInput)
      expect(apiKey).toEqual(result)
    })
  })

  describe('findValidApiKey', () => {
    it('should return the result of prismaService.apiKey.findFirst method', async () => {
      const result = {
        id: 1,
        name: 'test',
        key: 'dp-kljsdf892hhlk3hkl.kljsdf892hhlk3hkl',
        expiresAt: new Date(),
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          name: 'test',
          username: 'test',
          email: 'test@email.com',
        },
      }
      prismaService.apiKey.findFirst.mockResolvedValueOnce(result)
    })
  })
})
