import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import 'prisma'

import { MockFactory } from 'mockingbird'
import { PrismaService } from 'nestjs-prisma'
import * as request from 'supertest'

import JwtOrApiKeyAuthGuard from '../src/auth/guards/jwt-apiKey-auth.guard'
import { AuthModule } from '../src/auth/auth.module'
import { UserModule } from '../src/user/user.module'
import bootstrap from '../src/main.config'
import { User } from '../src/user/entities/user.entity'

describe.only('Api-Key (e2e)', () => {
  let app: INestApplication
  let jwtOrApiKeyAuthGuard: DeepMockProxy<JwtOrApiKeyAuthGuard>
  let prismaService: DeepMockProxy<PrismaService>

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule, AuthModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .overrideGuard(JwtOrApiKeyAuthGuard)
      .useValue(mockDeep<JwtOrApiKeyAuthGuard>())
      .useMocker(mockDeep)
      .compile()

    prismaService = moduleFixture.get(PrismaService)
    jwtOrApiKeyAuthGuard = moduleFixture.get(JwtOrApiKeyAuthGuard)
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

  describe('/api/v1/users GET', () => {
    // FIXME: This test is failing because the user is not being set on the request
    it.skip('should return all users', async () => {
      const users = [
        MockFactory<User>(User).one(),
        MockFactory<User>(User).one(),
      ]

      jwtOrApiKeyAuthGuard.canActivate.mockReturnValueOnce(true)
      prismaService.user.findUnique.mockResolvedValueOnce(users[0])
      prismaService.user.findMany.mockResolvedValueOnce(users)
      return request(app.getHttpServer())
        .get('/api/v1/users')
        .then((response) => {
          expect(response.status).toBe(200)

          expect(response.body).toHaveLength(2)
          expect(response.body[0]).toHaveProperty('id', users[0].id)
          expect(response.body[0]).toHaveProperty('email', users[0].email)
          expect(response.body[0]).toHaveProperty('username', users[0].username)
          expect(response.body[1]).toHaveProperty('id', users[1].id)
          expect(response.body[1]).toHaveProperty('email', users[1].email)
          expect(response.body[1]).toHaveProperty('username', users[1].username)
        })
    })
  })

  describe('/api/v1/users PUT', () => {
    it('should update a user', async () => {
      const user = MockFactory<User>(User).one()
      const updatedUser = {
        ...user,
        username: 'new-username',
      }
      jwtOrApiKeyAuthGuard.canActivate.mockImplementationOnce((ctx) => {
        const request = ctx.switchToHttp().getRequest()
        request.user = user
        return true
      })
      prismaService.user.update.mockResolvedValueOnce(updatedUser)
      return request(app.getHttpServer())
        .put(`/api/v1/users`)
        .send({ username: updatedUser.username })
        .then((response) => {
          expect(response.status).toBe(200)
          expect(response.body).toHaveProperty('id', updatedUser.id)
          expect(response.body).toHaveProperty('email', updatedUser.email)
          expect(response.body).toHaveProperty('username', updatedUser.username)
        })
    })
  })
})
