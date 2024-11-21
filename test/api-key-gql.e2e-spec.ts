import { INestApplication } from '@nestjs/common'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config'
import { GqlExecutionContext, GraphQLModule } from '@nestjs/graphql'
import { Test, TestingModule } from '@nestjs/testing'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { GraphQLError, GraphQLFormattedError } from 'graphql'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
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
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
          playground: false,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          context: ({ req, res }) => ({ req, res }),
          formatError: (error: GraphQLError) => {
            const graphQLFormattedError: GraphQLFormattedError = {
              message:
                (error.extensions?.originalError as Error)?.message ||
                error.message,
            }
            return graphQLFormattedError
          },
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

  describe('API Key Model', () => {
    describe('Mutations', () => {
      it('should create an api key if the authenticated user is not an admin and tries to create an API Key for themselves', async () => {
        const apiKey = MockFactory<ApiKey>(ApiKey).one()
        const user = MockFactory<User>(User)
          .mutate({ id: apiKey.userId, role: UserRole.USER })
          .one()
        apiKeyRepository.create.mockResolvedValueOnce(apiKey)
        jwtAuthGuard.canActivate.mockImplementationOnce((context) => {
          GqlExecutionContext.create(context).getContext().req.user = user
          return true
        })
        return request(app.getHttpServer())
          .post('/graphql')
          .send({
            query: `
              mutation CreateApiKey($data: CreateApiKeyDto!) {
                createApiKey(data: $data) {
                  id
                  name
                  key
                  userId
                  expiresAt
                  createdAt
                  updatedAt
                }
              }`,
            variables: {
              data: {
                name: apiKey.name,
                userId: apiKey.userId,
              },
            },
          })
          .then((response) => {
            expect(response.body.data.createApiKey).toHaveProperty(
              'id',
              apiKey.id,
            )
            expect(response.body.data.createApiKey).toHaveProperty(
              'name',
              apiKey.name,
            )
            expect(response.body.data.createApiKey).toHaveProperty('key')
            expect(response.body.data.createApiKey).toHaveProperty(
              'userId',
              apiKey.userId,
            )
          })
      })

      it('should create an api key if the authenticate is an admin and tries to create an API Key for another user', () => {
        const apiKey = MockFactory<ApiKey>(ApiKey).one()
        const user = MockFactory<User>(User)
          .mutate({ role: UserRole.ADMIN })
          .one()
        apiKeyRepository.create.mockResolvedValueOnce(apiKey)
        jwtAuthGuard.canActivate.mockImplementationOnce((context) => {
          GqlExecutionContext.create(context).getContext().req.user = user
          return true
        })
        return request(app.getHttpServer())
          .post('/graphql')
          .send({
            query: `
              mutation CreateApiKey($data: CreateApiKeyDto!) {
                createApiKey(data: $data) {
                  id
                  name
                  key
                  userId
                  expiresAt
                  createdAt
                  updatedAt
                }
              }`,
            variables: {
              data: {
                name: apiKey.name,
                userId: apiKey.userId,
              },
            },
          })
          .then((response) => {
            expect(response.body.data.createApiKey).toHaveProperty(
              'id',
              apiKey.id,
            )
            expect(response.body.data.createApiKey).toHaveProperty(
              'name',
              apiKey.name,
            )
            expect(response.body.data.createApiKey).toHaveProperty('key')
            expect(response.body.data.createApiKey).toHaveProperty(
              'userId',
              apiKey.userId,
            )
          })
      })

      it('should return 403 if the authenticated user is not an admin and tries to create an api key for another user', () => {
        const apiKey = MockFactory<ApiKey>(ApiKey).one()
        const user = MockFactory<User>(User)
          .mutate({ role: UserRole.USER })
          .one()
        apiKeyRepository.create.mockResolvedValueOnce(apiKey)
        jwtAuthGuard.canActivate.mockImplementationOnce((context) => {
          GqlExecutionContext.create(context).getContext().req.user = user
          return true
        })
        return request(app.getHttpServer())
          .post('/graphql')
          .send({
            query: `
              mutation CreateApiKey($data: CreateApiKeyDto!) {
                createApiKey(data: $data) {
                  id
                  name
                  key
                  userId
                  expiresAt
                  createdAt
                  updatedAt
                }
              }`,
            variables: {
              data: {
                name: apiKey.name,
                userId: apiKey.userId,
              },
            },
          })
          .then((response) => {
            expect(response.body).toHaveProperty('errors')
            expect(response.body.errors).toHaveLength(1)
          })
      })

      it('should return 401 if not authorized', async () => {
        const apiKey = MockFactory<ApiKey>(ApiKey).one()
        jwtAuthGuard.canActivate.mockReturnValueOnce(false)
        return request(app.getHttpServer())
          .post('/graphql')
          .send({
            query: `
              mutation CreateApiKey($data: CreateApiKeyDto!) {
                createApiKey(data: $data) {
                  id
                  name
                  key
                  userId
                  expiresAt
                  createdAt
                  updatedAt
                }
              }`,
            variables: {
              data: {
                name: apiKey.name,
                userId: apiKey.userId,
              },
            },
          })
          .then((response) => {
            expect(response.body).toHaveProperty('errors')
            expect(response.body.errors).toHaveLength(1)
          })
      })

      it('should return 400 if the user id is missing', async () => {
        const apiKey = MockFactory<ApiKey>(ApiKey).one()
        jwtAuthGuard.canActivate.mockReturnValueOnce(true)
        return request(app.getHttpServer())
          .post('/graphql')
          .send({
            query: `
              mutation CreateApiKey($data: CreateApiKeyDto!) {
                createApiKey(data: $data) {
                  id
                  name
                  key
                  userId
                  expiresAt
                  createdAt
                  updatedAt
                }
              }`,
            variables: {
              data: {
                name: apiKey.name,
              },
            },
          })
          .then((response) => {
            expect(response.body).toHaveProperty('errors')
            expect(response.body.errors).toHaveLength(1)
          })
      })

      it('should return 400 if name is missing', async () => {
        const apiKey = MockFactory<ApiKey>(ApiKey).one()
        jwtAuthGuard.canActivate.mockReturnValueOnce(true)
        return request(app.getHttpServer())
          .post('/graphql')
          .send({
            query: `
              mutation CreateApiKey($data: CreateApiKeyDto!) {
                createApiKey(data: $data) {
                  id
                  name
                  key
                  userId
                  expiresAt
                  createdAt
                  updatedAt
                }
              }`,
            variables: {
              data: {
                userId: apiKey.userId,
              },
            },
          })
          .then((response) => {
            expect(response.body).toHaveProperty('errors')
            expect(response.body.errors).toHaveLength(1)
          })
      })
    })
  })
})
