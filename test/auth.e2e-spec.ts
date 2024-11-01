import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as argon2 from 'argon2'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import * as request from 'supertest'

import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard'
import { AuthModule } from '../src/auth/auth.module'
import { UserService } from '../src/users/user.service'
import LoginDto from '../src/auth/dto/login.dto'
import bootstrap from '../src/main.config'
import { UserEntity } from '../src/users/entities/user.entity'

describe('Auth (e2e)', () => {
  let app: INestApplication
  let userService: DeepMockProxy<UserService>
  let jwtAuthGuard: DeepMockProxy<JwtAuthGuard>

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(UserService)
      .useValue(mockDeep<UserService>())
      .overrideGuard(JwtAuthGuard)
      .useValue(mockDeep<JwtAuthGuard>())
      .useMocker(mockDeep)
      .compile()

    userService = moduleFixture.get(UserService)
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

  describe('/api/v1/auth/login POST', () => {
    it('should login', async () => {
      const loginRequest = {
        username: 'test-username',
        password: 'test-password',
      } as LoginDto

      const user = {
        id: 1,
        username: 'test-username',
        email: loginRequest.username,
        password: 'hashed-password',
      } as UserEntity

      userService.findOne.mockResolvedValueOnce(user)
      jest.spyOn(argon2, 'verify').mockResolvedValueOnce(true)

      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginRequest)
        .then((response) => {
          expect(response.status).toBe(201)
          expect(response.body).toHaveProperty('accessToken')
          expect(response.body).toHaveProperty('refreshToken')
        })
    })

    it('should not login', async () => {
      const loginRequest = {
        username: 'test@email.com',
        password: 'incorrect-password',
      } as LoginDto

      const user = {
        id: 1,
        username: 'test-username',
        email: loginRequest.username,
        password: 'hashed-password',
      } as UserEntity

      userService.findOne.mockResolvedValueOnce(user)
      jest.spyOn(argon2, 'verify').mockResolvedValueOnce(false)

      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginRequest)
        .expect(401)
    })

    it('should not login if username is missing', async () => {
      const loginRequest = {
        password: 'test-password',
      } as LoginDto

      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginRequest)
        .expect(401)
    })

    it('should not login if password is missing', async () => {
      const loginRequest = {
        username: 'test-email.com',
      } as LoginDto

      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginRequest)
        .expect(401)
    })
  })

  describe('/api/v1/auth/refresh POST', () => {
    it('should refresh token', async () => {
      const loginRequest = {
        username: 'test-username',
        password: 'test-password',
      } as LoginDto

      const user = {
        id: 1,
        username: 'test-username',
        email: 'test-email',
      } as UserEntity

      userService.findOne.mockResolvedValueOnce(user)
      jwtAuthGuard.canActivate.mockImplementationOnce((ctx) => {
        const request = ctx.switchToHttp().getRequest()
        request.user = user
        return true
      })

      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Authorization', 'Bearer test-token')
        .send(loginRequest)
        .then((response) => {
          expect(response.status).toBe(201)
          expect(response.body).toHaveProperty('accessToken')
          expect(response.body).toHaveProperty('refreshToken')
        })
    })

    it('should not refresh token', async () => {
      const loginRequest = {
        username: 'test-username',
        password: 'test-password',
      } as LoginDto

      jwtAuthGuard.canActivate.mockReturnValueOnce(false)

      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .set('Authorization', 'Bearer test-token')
        .send(loginRequest)
        .expect(403) // 403 Forbidden vs 401 Unauthorized
    })
  })

  // describe('/api/v1/auth/profile GET', () => {
  //   it('should get profile with JWT authentication', async () => {
  //     const user = {
  //       id: 1,
  //       username: 'test-username',
  //       email: 'test-email',
  //     } as UserEntity

  //     jwtAuthGuard.canActivate.mockImplementationOnce((ctx) => {
  //       const request = ctx.switchToHttp().getRequest()
  //       console.log(user)
  //       request.user = user
  //       return true
  //     })

  //     return request(app.getHttpServer())
  //       .get('/api/v1/auth/profile')
  //       .set('Authorization', 'Bearer test-token')
  //       .then(response => {
  //         console.log(response.body)
  //         expect(response.status).toBe(200)
  //         expect(response.body).toEqual(user)
  //       })
  //   })

  //   it('should not get profile', async () => {

  //     return request(app.getHttpServer())
  //       .get('/api/v1/auth/profile')
  //       .expect(401)
  //   })
  // })
})
