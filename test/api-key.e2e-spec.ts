import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import 'prisma'

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { PrismaService } from 'nestjs-prisma'
import * as request from 'supertest'

import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard'
import { ApiKeyModule } from '../src/api-key/api-key.module'
import { ApiKeyEntity } from '../src/api-key/entities/api-key.entity'
import bootstrap from '../src/main.config'

describe.only('Api-Key (e2e)', () => {
  let app: INestApplication
  let jwtAuthGuard: DeepMockProxy<JwtAuthGuard>
  let prismaService: DeepMockProxy<PrismaService>

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiKeyModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .overrideGuard(JwtAuthGuard)
      .useValue(mockDeep<JwtAuthGuard>())
      .useMocker(mockDeep)
      .compile()

    prismaService = moduleFixture.get(PrismaService)
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

  describe('/api/v1/api-key POST', () => {
    it('should create an api key', async () => {
      const apiKey = {
        id: 1,
        name: 'test-key',
        key: 'test-key',
        userId: 1,
      } as ApiKeyEntity
      prismaService.apiKey.create.mockResolvedValueOnce(apiKey)
      jwtAuthGuard.canActivate.mockReturnValueOnce(true)
      return request(app.getHttpServer())
        .post('/api/v1/api-key')
        .send({
          name: 'test-key',
        })
        .then((response) => {
          expect(response.status).toBe(201)
          expect(response.body).toHaveProperty('id', apiKey.id)
          expect(response.body).toHaveProperty('name', apiKey.name)
          expect(response.body).toHaveProperty('key')
          expect(response.body).toHaveProperty('userId', apiKey.userId)
        })
    })

    it('should return 403 if not authorized', async () => {
      jwtAuthGuard.canActivate.mockReturnValueOnce(false)
      return request(app.getHttpServer())
        .post('/api/v1/api-key')
        .send({
          name: 'test-key',
        })
        .expect(403) // 403 Forbidden vs 401
    })

    it('should return 400 if name is missing', async () => {
      jwtAuthGuard.canActivate.mockReturnValueOnce(true)
      return request(app.getHttpServer())
        .post('/api/v1/api-key')
        .send({})
        .expect(400)
    })
  })

  describe('/api/v1/api-key/:id DELETE', () => {
    it('should delete an api key', async () => {
      const apiKey = {
        id: 1,
        name: 'test-key',
        key: 'test-key',
        userId: 1,
      } as ApiKeyEntity
      // apiKeyService.remove.mockResolvedValue(apiKey)
      prismaService.apiKey.delete.mockResolvedValueOnce(apiKey)
      jwtAuthGuard.canActivate.mockReturnValueOnce(true)
      return request(app.getHttpServer())
        .delete('/api/v1/api-key/1')
        .expect(200)
        .expect(apiKey)
    })

    it('should return 403 if not authorized', async () => {
      jwtAuthGuard.canActivate.mockReturnValueOnce(false)
      return request(app.getHttpServer())
        .delete('/api/v1/api-key/1')
        .expect(403) // 403 Forbidden vs 401
    })

    it('should return 404 if api key does not exist', async () => {
      prismaService.apiKey.delete.mockRejectedValueOnce(
        new PrismaClientKnownRequestError('Not Found', {
          code: 'P2025',
          clientVersion: '2.24.0',
        }),
      )
      jwtAuthGuard.canActivate.mockReturnValueOnce(true)
      return request(app.getHttpServer())
        .delete('/api/v1/api-key/1')
        .expect(404)
    })
  })
})
