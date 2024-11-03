import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiKeyController } from './api-key.controller'
import { ApiKeyService } from './api-key.service'
import { getApiKey, isGuarded } from '../utils/test-utils'
import { ApiKeyEntity } from './entities/api-key.entity'

describe('ApiKeyController', () => {
  let apiKeyController: ApiKeyController
  let apiKeyService: DeepMockProxy<ApiKeyService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiKeyController],
      providers: [
        {
          provide: ApiKeyService,
          useValue: mockDeep<ApiKeyService>(),
        },
      ],
    })
      .useMocker(mockDeep)
      .compile()

    apiKeyController = module.get(ApiKeyController)
    apiKeyService = module.get(ApiKeyService)
  })

  describe('create', () => {
    it('should return the result of apiKeyService create method', () => {
      const result: ApiKeyEntity = {
        id: 1,
        name: 'test',
        key: 'test-api-key',
        expiresAt: new Date(),
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      apiKeyService.createApiKey.mockResolvedValueOnce(result)
      expect(
        apiKeyController.create({ name: result.name }, 1),
      ).resolves.toEqual(result)
    })

    it('should call apiKeyService create method with the correct arguments', () => {
      const createApiKeyDto = { name: 'test' }
      apiKeyController.create(createApiKeyDto, 1)
      expect(apiKeyService.createApiKey).toHaveBeenCalledWith(
        createApiKeyDto,
        1,
      )
    })

    it('should be protected by the jwt guard', () => {
      expect(isGuarded(apiKeyController.create, JwtAuthGuard)).toBeTruthy()
    })
  })

  describe('delete', () => {
    it('should return the result of apiKeyService delete method', () => {
      const apiKey = getApiKey()
      apiKeyService.deleteApiKey.mockResolvedValue(apiKey)
      expect(
        apiKeyController.delete(apiKey.id, apiKey.userId),
      ).resolves.toEqual(apiKey)
    })

    it('should call apiKeyService delete method with the correct arguments', async () => {
      const apiKey = getApiKey()
      await apiKeyController.delete(apiKey.id, apiKey.userId)
      expect(apiKeyService.deleteApiKey).toHaveBeenCalledWith(
        apiKey.id,
        apiKey.userId,
      )
    })

    it('should be protected by the jwt guard', () => {
      expect(isGuarded(apiKeyController.create, JwtAuthGuard)).toBeTruthy()
    })
  })
})
