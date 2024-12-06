import * as crypto from 'crypto'
import { NotFoundException } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import * as argon2 from 'argon2'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { MockFactory } from 'mockingbird'

import { ApiKeyService } from './api-key.service'
import databaseConfig from '../config/database.config'
import httpConfig from '../config/http.config'
import loggingConfig from '../config/logging.config'
import securityConfig from '../config/security.config'
import { ApiKeyRepository } from './api-key.repository'
import { CreateApiKeyResponseDto } from './dto/create-api-key-response.dto'
import { ApiKey } from './entities/api-key.entity'

describe('ApiKeyService', () => {
  let apiKeyService: ApiKeyService
  let apiKeyRepository: DeepMockProxy<ApiKeyRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [httpConfig, databaseConfig, securityConfig, loggingConfig],
        }),
      ],
      providers: [ApiKeyService],
    })
      .useMocker(mockDeep)
      .compile()

    apiKeyRepository = module.get(ApiKeyRepository)
    apiKeyService = module.get(ApiKeyService)
  })

  describe('createApiKey', () => {
    it('should return the result of ApiKeyRepository.create method ', async () => {
      const apiKeyPart = Buffer.from('kljsdf892hhlk3hkl')
      const apiKey = MockFactory<ApiKey>(ApiKey).one()
      apiKeyRepository.create.mockResolvedValueOnce(apiKey)
      jest.spyOn(crypto, 'randomBytes').mockImplementation(() => {
        return apiKeyPart
      })
      jest
        .spyOn(argon2, 'hash')
        .mockResolvedValueOnce(apiKeyPart.toString('hex'))
      const createApiKeyDto = { name: 'test', userId: 1 }

      const result = await apiKeyService.create(createApiKeyDto)
      expect(result).toEqual({
        ...apiKey,
        key: `dp-${apiKeyPart.toString('hex')}.${apiKeyPart.toString('hex')}`,
      })
      expect(argon2.hash).toHaveBeenCalledWith(apiKeyPart.toString('hex'), {
        type: argon2.argon2i,
      })
    })

    it('should return the type of ApiKey', async () => {
      const apiKeyPart = Buffer.from('kljsdf892hhlk3hkl')
      const apiKey = MockFactory<ApiKey>(ApiKey).plain().one()
      apiKeyRepository.create.mockResolvedValueOnce(apiKey)
      jest.spyOn(crypto, 'randomBytes').mockImplementation(() => {
        return apiKeyPart
      })
      jest
        .spyOn(argon2, 'hash')
        .mockResolvedValueOnce(apiKeyPart.toString('hex'))
      const createApiKeyDto = { name: 'test', userId: 1 }

      const result = await apiKeyService.create(createApiKeyDto)
      expect(result).toEqual({
        ...apiKey,
        key: `dp-${apiKeyPart.toString('hex')}.${apiKeyPart.toString('hex')}`,
      })
      expect(apiKey).not.toBeInstanceOf(ApiKey)
      expect(result).toBeInstanceOf(CreateApiKeyResponseDto)
    })
  })

  describe('delete', () => {
    it('should return the result of ApiKeyRepository.delete method', async () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).one()
      apiKeyRepository.delete.mockResolvedValueOnce(apiKey)

      const result = await apiKeyService.delete(apiKey.id, apiKey.userId)
      expect(result).toEqual(apiKey)
    })

    it('should return the type of ApiKey', async () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).plain().one()
      apiKeyRepository.delete.mockResolvedValueOnce(apiKey)

      const result = await apiKeyService.delete(apiKey.id, apiKey.userId)
      expect(result).toEqual(apiKey)
      expect(apiKey).not.toBeInstanceOf(ApiKey)
      expect(result).toBeInstanceOf(ApiKey)
    })

    it('should throw NotFoundException if the apiKey is not found', async () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).one()
      apiKeyRepository.delete.mockResolvedValueOnce(null)

      apiKeyService
        .delete(apiKey.userId, apiKey.id)
        .then(() => new Error('Should not reach this point'))
        .catch((error) => {
          expect(error).toBeInstanceOf(NotFoundException)
        })
    })
  })

  describe('getValid', () => {
    it('should return the result of apiKeyRepository.findFirst method', async () => {
      const result = {
        id: 1,
        name: 'test',
        key: 'dp-kljsdf892hhlk3hkl.5657413213',
        expiresAt: new Date(),
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      apiKeyRepository.findFirst.mockResolvedValueOnce(result)
      const key = 'dp-kljsdf892hhlk3hkl.1657894531'
      const response = await apiKeyService.getValid(key)
      const prismaServiceFindFirstArgs =
        apiKeyRepository.findFirst.mock.calls[0][0]
      expect(prismaServiceFindFirstArgs.where.key).toEqual({
        startsWith: result.key.split('.')[0],
      })
      expect(response).toEqual(result)
    })

    it('should return the type of ApiKey', async () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).plain().one()
      apiKeyRepository.findFirst.mockResolvedValueOnce(apiKey)
      const result = await apiKeyService.getValid(apiKey.key)
      expect(result).toEqual(apiKey)
      expect(apiKey).not.toBeInstanceOf(ApiKey)
      expect(result).toBeInstanceOf(ApiKey)
    })

    it('should throw NotFoundException if the apiKey is not found', async () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).one()
      apiKeyRepository.findFirst.mockResolvedValueOnce(null)

      apiKeyService
        .getValid(apiKey.key)
        .then(() => new Error('Should not reach this point'))
        .catch((error) => {
          expect(error).toBeInstanceOf(NotFoundException)
        })
    })
  })

  describe('getAll', () => {
    it('should return the result of apiKeyRepository.findMany method', async () => {
      const apiKeys = [
        MockFactory<ApiKey>(ApiKey).one(),
        MockFactory<ApiKey>(ApiKey).one(),
      ]
      apiKeyRepository.findMany.mockResolvedValueOnce(apiKeys)

      const result = await apiKeyService.getAll({})
      expect(apiKeyRepository.findMany).toHaveBeenCalled()
      expect(result).toEqual(apiKeys)
    })

    it('should return the type of ApiKey', async () => {
      const apiKeys = [
        MockFactory<ApiKey>(ApiKey).plain().one(),
        MockFactory<ApiKey>(ApiKey).plain().one(),
      ]
      apiKeyRepository.findMany.mockResolvedValueOnce(apiKeys)

      const result = await apiKeyService.getAll({})
      expect(result).toEqual(apiKeys)
      for (const apiKey of apiKeys) {
        expect(apiKey).not.toBeInstanceOf(ApiKey)
      }
      for (const resultApiKey of result) {
        expect(resultApiKey).toBeInstanceOf(ApiKey)
      }
    })
  })

  describe('getById', () => {
    it('should return the result of apiKeyRepository.findFirst method', async () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).one()
      apiKeyRepository.findFirst.mockResolvedValueOnce(apiKey)

      const result = await apiKeyService.getById(apiKey.id)
      expect(apiKeyRepository.findFirst).toHaveBeenCalled()
      expect(result).toEqual(apiKey)
    })

    it('should return the type of ApiKey', async () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).plain().one()
      apiKeyRepository.findFirst.mockResolvedValueOnce(apiKey)

      const result = await apiKeyService.getById(apiKey.id)
      expect(result).toEqual(apiKey)
      expect(apiKey).not.toBeInstanceOf(ApiKey)
      expect(result).toBeInstanceOf(ApiKey)
    })

    it('should throw NotFoundException if the apiKey is not found', async () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).one()
      apiKeyRepository.findFirst.mockResolvedValueOnce(null)

      apiKeyService
        .getById(apiKey.id)
        .then(() => new Error('Should not reach this point'))
        .catch((error) => {
          expect(error).toBeInstanceOf(NotFoundException)
        })
    })
  })
})
