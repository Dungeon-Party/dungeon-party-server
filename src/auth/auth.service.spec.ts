import { NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import * as argon2 from 'argon2'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { ApiKeyService } from '../api-key/api-key.service'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'
import { UserEntity } from '../user/entities/user.entity'
import { getApiKey, getUser } from '../utils/test-utils'
import TokenResponseDto from './dto/token-response.dto'

describe('AuthService', () => {
  let authService: AuthService
  let jwtService: JwtService
  let apiKeyService: DeepMockProxy<ApiKeyService>
  let userService: DeepMockProxy<UserService>
  let configService: DeepMockProxy<ConfigService>

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
      controllers: [AuthController, AuthService],
      providers: [AuthService],
    })
      .useMocker(mockDeep)
      .overrideProvider(ApiKeyService)
      .useValue(mockDeep<ApiKeyService>())
      .overrideProvider(UserService)
      .useValue(mockDeep<UserService>())
      .overrideProvider(configService)
      .useValue(mockDeep<ConfigService>())
      .compile()

    apiKeyService = module.get(ApiKeyService)
    configService = module.get(ConfigService)
    jwtService = module.get(JwtService)
    userService = module.get(UserService)
    authService = module.get(AuthService)
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('validateUser', () => {
    it('should return a user when the credentials are valid', async () => {
      const user = {
        id: 1,
        username: 'test',
        email: 'test@email.com',
        password: 'test-password',
      }
      userService.findUserByEmailOrUsername.mockResolvedValueOnce(
        user as UserEntity,
      )
      jest.spyOn(argon2, 'verify').mockResolvedValueOnce(true)
      const response = await authService.validateUser(
        user.username,
        user.password,
      )
      expect(response).toEqual(user)
    })

    it('should throw an error when the user does not exist', async () => {
      userService.findUserByEmailOrUsername.mockResolvedValueOnce(null)
      try {
        await authService.validateUser('test', 'test')
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
      }
    })

    it('should throw an error when the password is incorrect', async () => {
      const user = {
        id: 1,
        username: 'test',
        email: 'test@email.com',
        password: 'test-password',
      }
      userService.findUserByEmailOrUsername.mockResolvedValueOnce(
        user as UserEntity,
      )
      jest.spyOn(argon2, 'verify').mockResolvedValueOnce(false)
      try {
        await authService.validateUser(user.username, 'wrong-password')
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException)
      }
    })
  })

  describe('generateJwt', () => {
    it('should return type of TokenResponseDto', async () => {
      const user = {
        id: 1,
        username: 'test',
        email: 'test@email.com',
        password: 'test-password',
      }
      configService.get.mockReturnValue('10m')
      const result = await authService.generateJwt(user as UserEntity)
      expect(result).toBeInstanceOf(TokenResponseDto)
    })

    it('should include the user information in the payload', async () => {
      const user = {
        id: 1,
        username: 'test',
        email: 'test@email.com',
        password: 'test-password',
      }
      configService.get.mockReturnValue('10m')
      const result = await authService.generateJwt(user as UserEntity)
      const decodedToken = jwtService.decode(result.accessToken)
      expect(decodedToken).toHaveProperty('sub', user.id)
      expect(decodedToken).toHaveProperty('username', user.username)
      expect(decodedToken).toHaveProperty('email', user.email)
    })
  })

  describe('validateApiKey', () => {
    it('should return a user when the API key is valid', async () => {
      const user = getUser()
      const apiKey = getApiKey()

      userService.findUserById.mockResolvedValueOnce(user)
      apiKeyService.findValidApiKey.mockResolvedValueOnce(apiKey)
      jest.spyOn(argon2, 'verify').mockResolvedValueOnce(true)
      const response = await authService.validateApiKey(apiKey.key)
      expect(response).toEqual(user)
    })

    it('should throw an error when the API key is invalid', async () => {
      const apiKey = getApiKey()

      apiKeyService.findValidApiKey.mockResolvedValueOnce(apiKey)
      jest.spyOn(argon2, 'verify').mockResolvedValueOnce(false)
      return authService
        .validateApiKey(apiKey.key)
        .then(() => new Error('Should not reach this point'))
        .catch((error) => {
          expect(error).toBeInstanceOf(UnauthorizedException)
        })
    })
  })
})
