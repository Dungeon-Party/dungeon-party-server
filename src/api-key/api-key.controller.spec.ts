import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiKeyController } from './api-key.controller'
import { ApiKeyService } from './api-key.service'
import { isGuarded } from '../utils/test-utils'
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
      apiKeyService.create.mockResolvedValueOnce(result)
      expect(
        apiKeyController.create({ name: result.name }, 1),
      ).resolves.toEqual(result)
    })

    it('should call apiKeyService create method with the correct arguments', () => {
      const createApiKeyDto = { name: 'test' }
      apiKeyController.create(createApiKeyDto, 1)
      expect(apiKeyService.create).toHaveBeenCalledWith(createApiKeyDto, 1)
    })

    it('should be protected by the jwt guard', () => {
      expect(isGuarded(apiKeyController.create, JwtAuthGuard)).toBeTruthy()
    })
  })

  describe('remove', () => {
    it('should return the result of apiKeyService remove method', () => {
      const result: ApiKeyEntity = {
        id: 1,
        name: 'test',
        key: 'test-api-key',
        expiresAt: new Date(),
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      apiKeyService.remove.mockResolvedValue(result)
      expect(apiKeyController.remove('1', 1)).resolves.toEqual(result)
    })

    it('should call apiKeyService remove method with the correct arguments', () => {
      const id = '1'
      apiKeyController.remove(id, 1)
      expect(apiKeyService.remove).toHaveBeenCalledWith({
        id: Number(id),
        userId: 1,
      })
    })

    it('should be protected by the jwt guard', () => {
      expect(isGuarded(apiKeyController.create, JwtAuthGuard)).toBeTruthy()
    })
  })
})
