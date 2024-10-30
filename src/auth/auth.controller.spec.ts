import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { UserModule } from '../users/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserEntity } from '../users/entities/user.entity'

describe('AuthController', () => {
  let authController: AuthController
  let authService: DeepMockProxy<AuthService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        JwtModule.register({
          global: true,
          secret: 'test-secret',
          signOptions: { expiresIn: '10m' },
        }),
        PassportModule,
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockDeep<AuthService>(),
        },
      ],
    })
      .useMocker(mockDeep)
      .compile()

    authController = module.get(AuthController)
    authService = module.get(AuthService)
  })

  describe('login', () => {
    it('should return an access token and a refresh token', () => {
      const result = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      }
      authService.generateJwt.mockResolvedValueOnce(result)
      expect(
        authController.login({
          email: 'test@email.com',
          password: 'test-password',
        } as UserEntity),
      ).resolves.toEqual(result)
    })

    it.todo('should return an error when the user does not exist')

    it.todo('should return an error when the password is incorrect')

    it.todo('should be protected by the local strategy')
  })

  describe('refresh', () => {
    it.todo('should return an access token')

    it.todo('should return an error when the user does not exist')

    it.todo('should return an error when the password is incorrect')

    it.todo('should be protected by the jwt strategy')
  })

  describe('profile', () => {
    it.todo('should return the user profile')

    it.todo('should return an error when the user does not exist')

    it.todo('should be protected by the jwt strategy')

    it.todo('should be protected by the api key strategy')
  })
})
