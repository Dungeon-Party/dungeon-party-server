import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import JwtOrApiKeyAuthGuard from './guards/jwt-apiKey-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserEntity } from '../user/entities/user.entity'
import { isGuarded } from '../utils/test-utils'
import TokenResponseDto from './dto/token-response.dto'

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
    it('should return the result of AuthService.generateJwt', async () => {
      const result = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      } as TokenResponseDto
      authService.generateJwt.mockResolvedValueOnce(result)
      const response = await authController.login({
        email: 'test-email',
        password: 'test-password',
      } as UserEntity)
      expect(response).toEqual(result)
    })

    it('should be protected by the local guard', () => {
      expect(isGuarded(authController.login, LocalAuthGuard)).toBeTruthy()
    })
  })

  describe('refresh', () => {
    it('should return the result of AuthService.generateJwt', async () => {
      const result = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      } as TokenResponseDto
      authService.generateJwt.mockResolvedValueOnce(result)
      const response = await authController.refresh({
        email: 'test-email',
        password: 'test-password',
      } as UserEntity)
      expect(response).toEqual(result)
    })

    it('should be protected by the jwt strategy', () => {
      expect(isGuarded(authController.refresh, JwtAuthGuard)).toBeTruthy()
    })
  })

  describe('profile', () => {
    it('should return the user profile', () => {
      const user = { email: 'test-email' } as UserEntity
      expect(authController.getProfile(user)).toEqual(user)
    })

    it('should be protected by the jwt or api-key strategy', () => {
      expect(
        isGuarded(authController.getProfile, JwtOrApiKeyAuthGuard),
      ).toBeTruthy()
    })
  })
})
