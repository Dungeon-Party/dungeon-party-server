import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { MockFactory } from 'mockingbird'

import { JwtOrApiKeyAuthGuard } from './guards/jwt-apiKey-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { User } from '../user/entities/user.entity'
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
      } as User)
      expect(response).toEqual(result)
    })

    it('should be protected by the local guard', () => {
      expect(
        Reflect.getMetadata('__guards__', authController.login).some(
          (guard) => guard.name === LocalAuthGuard.name,
        ),
      ).toBeTruthy()
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
      } as User)
      expect(response).toEqual(result)
    })

    it('should be protected by the jwt strategy', () => {
      expect(
        Reflect.getMetadata('__guards__', authController.refresh).some(
          (guard) => guard.name === JwtAuthGuard.name,
        ),
      ).toBeTruthy()
    })
  })

  describe('profile', () => {
    it('should return the user profile', () => {
      const user = { email: 'test-email' } as User
      expect(authController.getProfile(user)).toEqual(user)
    })

    it('should be protected by the jwt or api-key strategy', () => {
      expect(
        Reflect.getMetadata('__guards__', authController.getProfile).some(
          (guard) => guard.name === JwtOrApiKeyAuthGuard.name,
        ),
      ).toBeTruthy()
    })
  })

  describe('register', () => {
    it('should return the result of AuthService.register', async () => {
      const user = MockFactory<User>(User).one()
      authService.register.mockResolvedValueOnce(user)
      const result = await authController.register({
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        passwordConfirmation: user.password,
      })
      expect(result).toEqual(user)
    })
  })
})
