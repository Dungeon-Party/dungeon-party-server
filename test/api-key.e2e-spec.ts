import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import 'prisma'

import { ConfigModule } from '@nestjs/config'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { MockFactory } from 'mockingbird'
import * as request from 'supertest'

import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard'
import { ApiKeyModule } from '../src/api-key/api-key.module'
import { ApiKeyRepository } from '../src/api-key/api-key.repository'
import { ApiKey } from '../src/api-key/entities/api-key.entity'
import databaseConfig from '../src/config/database.config'
import httpConfig from '../src/config/http.config'
import loggingConfig from '../src/config/logging.config'
import securityConfig from '../src/config/security.config'
import bootstrap from '../src/main.config'
import { UserRole } from '../src/types'
import { User } from '../src/user/entities/user.entity'

describe('Api-Key (e2e)', () => {
  let app: INestApplication
  let jwtAuthGuard: DeepMockProxy<JwtAuthGuard>
  let apiKeyRepository: DeepMockProxy<ApiKeyRepository>

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ApiKeyModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [httpConfig, databaseConfig, securityConfig, loggingConfig],
        }),
      ],
    })
      .overrideProvider(ApiKeyRepository)
      .useValue(mockDeep<ApiKeyRepository>())
      .overrideGuard(JwtAuthGuard)
      .useValue(mockDeep<JwtAuthGuard>())
      .useMocker(mockDeep)
      .compile()

    apiKeyRepository = moduleFixture.get(ApiKeyRepository)
    jwtAuthGuard = moduleFixture.get(JwtAuthGuard)
    app = moduleFixture.createNestApplication()

    bootstrap(app)

    await app.init()
  })

  afterEach(async () => {
    jest.resetAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/api/v1/api-keys POST', () => {
    it('should create an api key if the authenticated user is not an admin and tries to create an API Key for themselves', async () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).one()
      const user = MockFactory<User>(User)
        .mutate({ id: apiKey.userId, role: UserRole.USER })
        .one()
      apiKeyRepository.create.mockResolvedValueOnce(apiKey)
      jwtAuthGuard.canActivate.mockImplementationOnce((context) => {
        context.switchToHttp().getRequest().user = user
        return true
      })
      return request(app.getHttpServer())
        .post('/api/v1/api-keys')
        .send({
          name: apiKey.name,
          userId: apiKey.userId,
        })
        .then((response) => {
          expect(response.status).toBe(201)
          expect(response.body).toHaveProperty('id', apiKey.id)
          expect(response.body).toHaveProperty('name', apiKey.name)
          expect(response.body).toHaveProperty('key')
          expect(response.body).toHaveProperty('userId', apiKey.userId)
        })
    })

    it('should create an api key if the authenticate is an admin and tries to create an API Key for another user', () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).one()
      const user = MockFactory<User>(User)
        .mutate({ role: UserRole.ADMIN })
        .one()
      apiKeyRepository.create.mockResolvedValueOnce(apiKey)
      jwtAuthGuard.canActivate.mockImplementationOnce((context) => {
        context.switchToHttp().getRequest().user = user
        return true
      })
      return request(app.getHttpServer())
        .post('/api/v1/api-keys')
        .send({
          name: apiKey.name,
          userId: apiKey.userId,
        })
        .then((response) => {
          expect(response.status).toBe(201)
          expect(response.body).toHaveProperty('id', apiKey.id)
          expect(response.body).toHaveProperty('name', apiKey.name)
          expect(response.body).toHaveProperty('key')
          expect(response.body).toHaveProperty('userId', apiKey.userId)
        })
    })

    it('should return 403 if the authenticated user is not an admin and tries to create an api key for another user', () => {
      const apiKey = MockFactory<ApiKey>(ApiKey).one()
      const user = MockFactory<User>(User).mutate({ role: UserRole.USER }).one()
      apiKeyRepository.create.mockResolvedValueOnce(apiKey)
      jwtAuthGuard.canActivate.mockImplementationOnce((context) => {
        context.switchToHttp().getRequest().user = user
        return true
      })
      return request(app.getHttpServer())
        .post('/api/v1/api-keys')
        .send({
          name: 'test-key',
          userId: apiKey.userId,
        })
        .then((response) => {
          expect(response.status).toBe(403)
        })
    })

    it('should return 401 if not authorized', async () => {
      jwtAuthGuard.canActivate.mockImplementationOnce((context) => {
        context.switchToHttp().getRequest().isAuthenticated = false
        return false
      })
      return request(app.getHttpServer())
        .post('/api/v1/api-keys')
        .set('Authorization', 'Bearer test-token')
        .send({
          name: 'test-key',
          userId: 1,
        })
        .expect(403) // FIXME: 403 Forbidden vs 401
    })

    it('should return 400 if the user id is missing', async () => {
      jwtAuthGuard.canActivate.mockReturnValueOnce(true)
      return request(app.getHttpServer())
        .post('/api/v1/api-keys')
        .send({ name: 'test-key' })
        .expect(400)
    })

    it('should return 400 if name is missing', async () => {
      jwtAuthGuard.canActivate.mockReturnValueOnce(true)
      return request(app.getHttpServer())
        .post('/api/v1/api-keys')
        .send({ userId: 1 })
        .expect(400)
    })
  })

  describe('/api/v1/api-keys/:id DELETE', () => {
    it('should delete an api key', async () => {
      const apiKey = {
        id: 1,
        name: 'test-key',
        key: 'test-key', // Ensure that the key is not exposed
        userId: 1,
      } as ApiKey
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { key, ...response } = apiKey
      apiKeyRepository.delete.mockResolvedValueOnce(apiKey)
      jwtAuthGuard.canActivate.mockReturnValueOnce(true)
      return request(app.getHttpServer())
        .delete('/api/v1/api-keys/1')
        .expect(200)
        .expect(response)
    })

    it('should return 403 if not authorized', async () => {
      jwtAuthGuard.canActivate.mockReturnValueOnce(false)
      return request(app.getHttpServer())
        .delete('/api/v1/api-keys/1')
        .expect(403) // FIXME: 403 Forbidden vs 401
    })

    it('should return 404 if api key does not exist', async () => {
      apiKeyRepository.delete.mockRejectedValueOnce(
        new PrismaClientKnownRequestError('Not Found', {
          code: 'P2025',
          clientVersion: '2.24.0',
        }),
      )
      jwtAuthGuard.canActivate.mockReturnValueOnce(true)
      return request(app.getHttpServer())
        .delete('/api/v1/api-keys/1')
        .expect(404)
    })
  })
})
