import * as crypto from 'crypto'
import { Test, TestingModule } from '@nestjs/testing'
import * as argon2 from 'argon2'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { ApiKeyService } from './api-key.service'
import { getApiKey } from '../utils/test-utils'
import { ApiKeyRepository } from './api-key.repository'
import { CreateApiKeyResponseDto } from './dto/create-api-key-response.dto'
import { ApiKey } from './entities/api-key.entity'

describe('ApiKeyService', () => {
  let apiKeyService: ApiKeyService
  let apiKeyRepository: DeepMockProxy<ApiKeyRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      const apiKey = getApiKey()
      apiKeyRepository.create.mockResolvedValueOnce(apiKey)
      jest.spyOn(crypto, 'randomBytes').mockImplementation(() => {
        return apiKeyPart
      })
      jest
        .spyOn(argon2, 'hash')
        .mockResolvedValueOnce(apiKeyPart.toString('hex'))
      const createApiKeyDto = { name: 'test' }

      const result = await apiKeyService.createApiKey(1, createApiKeyDto)
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
      const apiKey = getApiKey()
      apiKeyRepository.create.mockResolvedValueOnce(apiKey)
      jest.spyOn(crypto, 'randomBytes').mockImplementation(() => {
        return apiKeyPart
      })
      jest
        .spyOn(argon2, 'hash')
        .mockResolvedValueOnce(apiKeyPart.toString('hex'))
      const createApiKeyDto = { name: 'test', userId: 1 }

      const result = await apiKeyService.createApiKey(1, createApiKeyDto)
      expect(result).toEqual({
        ...apiKey,
        key: `dp-${apiKeyPart.toString('hex')}.${apiKeyPart.toString('hex')}`,
      })
      expect(apiKey).not.toBeInstanceOf(ApiKey)
      expect(result).toBeInstanceOf(CreateApiKeyResponseDto)
    })
  })

  describe('deleteApiKey', () => {
    it('should return the result of ApiKeyRepository.delete method', async () => {
      const apiKey = getApiKey()
      apiKeyRepository.delete.mockResolvedValueOnce(apiKey)

      const result = await apiKeyService.deleteApiKey(apiKey.id, apiKey.userId)
      expect(result).toEqual(apiKey)
    })

    it('should return the type of ApiKey', async () => {
      const apiKey = getApiKey()
      apiKeyRepository.delete.mockResolvedValueOnce(apiKey)

      const result = await apiKeyService.deleteApiKey(apiKey.id, apiKey.userId)
      expect(result).toEqual(apiKey)
      expect(apiKey).not.toBeInstanceOf(ApiKey)
      expect(result).toBeInstanceOf(ApiKey)
    })
  })

  describe('findOne', () => {
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
      const response = await apiKeyService.findValidApiKey(key)
      const prismaServiceFindFirstArgs =
        apiKeyRepository.findFirst.mock.calls[0][0]
      expect(prismaServiceFindFirstArgs.where.key).toEqual({
        startsWith: result.key.split('.')[0],
      })
      expect(response).toEqual(result)
    })

    it('should return the type of ApiKey', async () => {
      const apiKey = getApiKey()
      apiKeyRepository.findFirst.mockResolvedValueOnce(apiKey)
      const result = await apiKeyService.findValidApiKey(apiKey.key)
      expect(result).toEqual(apiKey)
      expect(apiKey).not.toBeInstanceOf(ApiKey)
      expect(result).toBeInstanceOf(ApiKey)
    })
  })
})
