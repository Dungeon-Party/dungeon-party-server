import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { ApiKeyController } from './api-key.controller'
import { ApiKeyService } from './api-key.service'
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
        apiKeyController.create({ name: result.name, userId: result.userId }),
      ).resolves.toEqual(result)
    })

    it('should call apiKeyService create method with the correct arguments', () => {
      const createApiKeyDto = { name: 'test', userId: 1 }
      apiKeyController.create(createApiKeyDto)
      expect(apiKeyService.create).toHaveBeenCalledWith(createApiKeyDto)
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
      expect(apiKeyController.remove('1')).resolves.toEqual(result)
    })

    it('should call apiKeyService remove method with the correct arguments', () => {
      const id = '1'
      apiKeyController.remove(id)
      expect(apiKeyService.remove).toHaveBeenCalledWith({ id: Number(id) })
    })
  })
})
