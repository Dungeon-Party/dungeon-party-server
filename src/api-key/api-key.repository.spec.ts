import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { PrismaService } from 'nestjs-prisma'

import { getApiKey } from '../utils/test-utils'
import { ApiKeyRepository } from './api-key.repository'

describe('ApiKeyRepository', () => {
  let apiKeyRepository: ApiKeyRepository
  let prismaService: DeepMockProxy<PrismaService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiKeyRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .useMocker(mockDeep)
      .compile()

    prismaService = module.get(PrismaService)
    apiKeyRepository = module.get(ApiKeyRepository)
  })

  describe('createApiKey', () => {
    it('should return the value of prismaService.apiKey.create', async () => {
      const apiKey = getApiKey()
      const params = {
        data: { ...apiKey, user: { connect: { id: apiKey.userId } } },
      }
      prismaService.apiKey.create.mockResolvedValue(apiKey)

      const result = await apiKeyRepository.createApiKey(params)

      expect(result).toEqual(apiKey)
      expect(prismaService.apiKey.create).toHaveBeenCalledWith(params)
    })
  })

  describe('getApiKey', () => {
    it('should return the value of prismaService.apiKey.findUnique', async () => {
      const apiKey = getApiKey()
      const params = { where: { id: apiKey.id } }
      prismaService.apiKey.findUnique.mockResolvedValue(apiKey)

      const result = await apiKeyRepository.getApiKey(params)

      expect(result).toEqual(apiKey)
      expect(prismaService.apiKey.findUnique).toHaveBeenCalledWith(params)
    })
  })

  describe('getApiKeys', () => {
    it('should return the value of prismaService.apiKey.findMany', async () => {
      const apiKeys = [getApiKey(), getApiKey()]
      const params = { skip: 0, take: 10 }
      prismaService.apiKey.findMany.mockResolvedValue(apiKeys)

      const result = await apiKeyRepository.getApiKeys(params)

      expect(result).toEqual(apiKeys)
      expect(prismaService.apiKey.findMany).toHaveBeenCalledWith(params)
    })
  })

  describe('findApiKey', () => {
    it('should return the value of prismaService.apiKey.findFirst', async () => {
      const apiKey = getApiKey()
      const params = {
        where: { name: apiKey.name },
      }
      prismaService.apiKey.findFirst.mockResolvedValue(apiKey)

      const result = await apiKeyRepository.findApiKey(params)

      expect(result).toEqual(apiKey)
      expect(prismaService.apiKey.findFirst).toHaveBeenCalledWith(params)
    })
  })

  describe('updateApiKey', () => {
    it('should return the value of prismaService.apiKey.update', async () => {
      const apiKey = getApiKey()
      const params = { where: { id: apiKey.id }, data: apiKey }
      prismaService.apiKey.update.mockResolvedValue(apiKey)

      const result = await apiKeyRepository.updateApiKey(params)

      expect(result).toEqual(apiKey)
      expect(prismaService.apiKey.update).toHaveBeenCalledWith(params)
    })
  })

  describe('deleteApiKey', () => {
    it('should return the value of prismaService.apiKey.delete', async () => {
      const apiKey = getApiKey()
      const params = { where: { id: apiKey.id } }
      prismaService.apiKey.delete.mockResolvedValue(apiKey)

      const result = await apiKeyRepository.deleteApiKey(params)

      expect(result).toEqual(apiKey)
      expect(prismaService.apiKey.delete).toHaveBeenCalledWith(params)
    })
  })
})
