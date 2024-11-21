import { ForbiddenException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { MockFactory } from 'mockingbird'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiKeyService } from './api-key.service'
import { UserRole } from '../types'
import { User } from '../user/entities/user.entity'
import { ApiKeyResolver } from './api-key.resolver'
import { ApiKey } from './entities/api-key.entity'

describe('ApiKeyResolver', () => {
  let apiKeyResolver: ApiKeyResolver
  let apiKeyService: DeepMockProxy<ApiKeyService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiKeyResolver],
      providers: [
        {
          provide: ApiKeyService,
          useValue: mockDeep<ApiKeyService>(),
        },
      ],
    })
      .useMocker(mockDeep)
      .compile()

    apiKeyResolver = module.get(ApiKeyResolver)
    apiKeyService = module.get(ApiKeyService)
  })

  describe('create', () => {
    it('should create an API Key when the authenticated user tries to create an API Key for themselves', () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).one()
      const user = MockFactory<User>(User).mutate({ id: apiKey.userId }).one()
      apiKeyService.create.mockResolvedValueOnce(apiKey)
      expect(
        apiKeyResolver.create(user, { name: apiKey.name, userId: user.id }),
      ).resolves.toEqual(apiKey)
    })

    it('should be protected by the jwt guard', () => {
      expect(
        Reflect.getMetadata('__guards__', apiKeyResolver.create).some(
          (guard) => guard.name === JwtAuthGuard.name,
        ),
      ).toBeTruthy()
    })

    it('should create an API Key when the user is an admin and creates an API Key for another user', async () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).one()
      const user = MockFactory<User>(User)
        .mutate({ role: UserRole.ADMIN })
        .one()
      apiKeyService.create.mockResolvedValueOnce(apiKey)
      expect(
        apiKeyResolver.create(user, {
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
        apiKeyResolver.create(user, {
          name: apiKey.name,
          userId: apiKey.userId,
        }),
      ).rejects.toThrow(ForbiddenException)
    })
  })
})
