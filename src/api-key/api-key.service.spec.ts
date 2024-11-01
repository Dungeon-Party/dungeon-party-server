import * as crypto from 'crypto'
import { Test, TestingModule } from '@nestjs/testing'
import * as argon2 from 'argon2'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { PrismaService } from 'nestjs-prisma'

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
    it('should return the result of PrismaService.apiKey.create method ', async () => {
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
      const createApiKeyDto = { name: 'test' }

      const apiKey = await apiKeyService.create(createApiKeyDto, 1)
      expect(apiKey).toEqual({
        ...result,
        key: `dp-${apiKeyPart.toString('hex')}.${apiKeyPart.toString('hex')}`,
      })
      expect(argon2.hash).toHaveBeenCalledWith(apiKeyPart.toString('hex'), {
        type: argon2.argon2i,
      })
    })

    it('should return the type of ApiKeyEntity', async () => {
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

      const apiKey = await apiKeyService.create(createApiKeyDto, 1)
      expect(apiKey).toEqual({
        ...result,
        key: `dp-${apiKeyPart.toString('hex')}.${apiKeyPart.toString('hex')}`,
      })
      expect(apiKey).toBeInstanceOf(ApiKeyEntity)
    })
  })

  describe('remove', () => {
    it('should return the result of PrismaService.apiKey.delete method', async () => {
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

      const apiKey = await apiKeyService.delete(ApiKeyWhereUniqueInput)
      expect(apiKey).toEqual(result)
    })

    it('should return the type of ApiKeyEntity', async () => {
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

      const apiKey = await apiKeyService.delete(ApiKeyWhereUniqueInput)
      expect(apiKey).toEqual(result)
      expect(apiKey).toBeInstanceOf(ApiKeyEntity)
    })
  })

  describe('findOne', () => {
    it('should return the result of prismaService.apiKey.findFirst method', async () => {
      const result = {
        id: 1,
        name: 'test',
        key: 'dp-kljsdf892hhlk3hkl.5657413213',
        expiresAt: new Date(),
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      prismaService.apiKey.findFirst.mockResolvedValueOnce(result)
      const key = 'dp-kljsdf892hhlk3hkl.1657894531'
      const response = await apiKeyService.findOne(key)
      const prismaServiceFindFirstArgs =
        prismaService.apiKey.findFirst.mock.calls[0][0]
      expect(prismaServiceFindFirstArgs.where.key).toEqual({
        startsWith: result.key.split('.')[0],
      })
      expect(response).toEqual(result)
    })

    it('should return null if the key is not found', async () => {
      prismaService.apiKey.findFirst.mockResolvedValueOnce(null)
      expect(await apiKeyService.findOne('invalid-key')).toBeNull()
    })
  })
})
