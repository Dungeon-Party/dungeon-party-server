import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { MockFactory } from 'mockingbird'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiKeyController } from './api-key.controller'
import { ApiKeyService } from './api-key.service'
import { User } from '../user/entities/user.entity'
import { ApiKey } from './entities/api-key.entity'

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
      const result: ApiKey = {
        id: 1,
        name: 'test',
        key: 'test-api-key',
        expiresAt: new Date(),
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const user = MockFactory<User>(User).mutate({ id: 1 }).one()
      apiKeyService.createApiKey.mockResolvedValueOnce(result)
      expect(
        apiKeyController.create({ name: result.name, userId: 1 }, user),
      ).resolves.toEqual(result)
    })

    it('should call apiKeyService create method with the correct arguments', () => {
      const user = MockFactory<User>(User).mutate({ id: 1 }).one()
      const createApiKeyDto = { name: 'test', userId: user.id }
      apiKeyController.create(createApiKeyDto, user)
      expect(apiKeyService.createApiKey).toHaveBeenCalledWith(createApiKeyDto)
    })

    it('should be protected by the jwt guard', () => {
      expect(
        Reflect.getMetadata('__guards__', apiKeyController.create).some(
          (guard) => guard.name === JwtAuthGuard.name,
        ),
      ).toBeTruthy()
    })
  })

  describe('delete', () => {
    it('should return the result of apiKeyService delete method', () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).one()
      apiKeyService.deleteApiKey.mockResolvedValue(apiKey)
      expect(
        apiKeyController.delete(apiKey.id, apiKey.userId),
      ).resolves.toEqual(apiKey)
    })

    it('should call apiKeyService delete method with the correct arguments', async () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).one()
      await apiKeyController.delete(apiKey.id, apiKey.userId)
      expect(apiKeyService.deleteApiKey).toHaveBeenCalledWith(
        apiKey.id,
        apiKey.userId,
      )
    })

    it('should be protected by the jwt guard', () => {
      expect(
        Reflect.getMetadata('__guards__', apiKeyController.delete).some(
          (guard) => guard.name === JwtAuthGuard.name,
        ),
      ).toBeTruthy()
    })
  })
})
