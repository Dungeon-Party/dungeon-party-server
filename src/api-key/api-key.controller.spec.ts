import { ForbiddenException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { MockFactory } from 'mockingbird'

// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiKeyController } from './api-key.controller'
import { ApiKeyService } from './api-key.service'
import { UserRole } from '../types'
import { User } from '../user/entities/user.entity'
import { GetApiKeyParamsDto } from './dto/get-api-key-params.dto'
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

  // FIXME: Unable to get guards metadata from class
  // it.only('should be protected by the jwt guard', () => {
  //   console.log(Reflect.getMetadata('__guards__', apiKeyController))
  //   expect(
  //     Reflect.getMetadata('__guards__', apiKeyController).some(
  //       (guard) => guard.name === JwtAuthGuard.name,
  //     ),
  //   ).toBeTruthy()
  // })

  describe('create', () => {
    it('should create an API Key when the authenticated user tries to create an API Key for themselves', () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).one()
      const user = MockFactory<User>(User).mutate({ id: apiKey.userId }).one()
      apiKeyService.create.mockResolvedValueOnce(apiKey)
      expect(
        apiKeyController.create(user, { name: apiKey.name, userId: user.id }),
      ).resolves.toEqual(apiKey)
    })

    it('should call apiKeyService create method with the correct arguments', () => {
      const user = MockFactory<User>(User).mutate({ id: 1 }).one()
      const createApiKeyDto = { name: 'test', userId: user.id }
      apiKeyController.create(user, createApiKeyDto)
      expect(apiKeyService.create).toHaveBeenCalledWith(createApiKeyDto)
    })

    it('should create an API Key when the user is an admin and creates an API Key for another user', async () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).one()
      const user = MockFactory<User>(User)
        .mutate({ role: UserRole.ADMIN })
        .one()
      apiKeyService.create.mockResolvedValueOnce(apiKey)
      expect(
        apiKeyController.create(user, {
          name: apiKey.name,
          userId: apiKey.userId,
        }),
      ).resolves.toEqual(apiKey)
    })

    it('should throw a ForbiddenException error when the user is not an admin and tries to create an API Key for another user', () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).one()
      const user = MockFactory<User>(User).mutate({ role: UserRole.USER }).one()
      apiKeyService.create.mockResolvedValueOnce(apiKey)
      expect(
        apiKeyController.create(user, {
          name: apiKey.name,
          userId: apiKey.userId,
        }),
      ).rejects.toThrow(ForbiddenException)
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
  })

  describe('getAllApiKeys', () => {
    it('should call apiKeyService.getAllApiKeys with empty params to retrieve all API Keys if the authenticated user is an Admin', () => {
      const apiKeys = MockFactory<ApiKey>(ApiKey).many(5)
      const user = MockFactory<User>(User)
        .mutate({ role: UserRole.ADMIN })
        .one()
      apiKeyService.getAllApiKeys.mockResolvedValue(apiKeys)
      expect(
        apiKeyController.getAllApiKeys(user, {} as GetApiKeyParamsDto),
      ).resolves.toEqual(apiKeys)
      expect(apiKeyService.getAllApiKeys).toHaveBeenCalledWith({})
    })

    it('should call apiKeyService.getAllApiKeys with the uer id to retrieve API Keys if the authenticated user is not an Admin', () => {
      const apiKeys = MockFactory<ApiKey>(ApiKey).many(5)
      const user = MockFactory<User>(User).mutate({ role: UserRole.USER }).one()
      apiKeyService.getAllApiKeys.mockResolvedValue(apiKeys)
      expect(
        apiKeyController.getAllApiKeys(user, {} as GetApiKeyParamsDto),
      ).resolves.toEqual(apiKeys)
      expect(apiKeyService.getAllApiKeys).toHaveBeenCalledWith({
        userId: user.id,
      })
    })
  })
})
