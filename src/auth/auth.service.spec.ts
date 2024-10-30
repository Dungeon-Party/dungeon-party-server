import { NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import * as argon2 from 'argon2'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { UserModule } from '../users/user.module'
import { AuthController } from './auth.controller'
import { UserService } from '../users/user.service'
import { AuthService } from './auth.service'
import { UserEntity } from '../users/entities/user.entity'
import TokenResponseDto from './dto/token-response.dto'

describe('AuthService', () => {
  let authService: AuthService
  let jwtService: JwtService
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
      .overrideProvider(UserService)
      .useValue(mockDeep<UserService>())
      .overrideProvider(configService)
      .useValue(mockDeep<ConfigService>())
      .compile()

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
      userService.findOne.mockResolvedValueOnce(user as UserEntity)
      jest.spyOn(argon2, 'verify').mockResolvedValueOnce(true)
      const response = await authService.validateUser(
        user.username,
        user.password,
      )
      expect(response).toEqual(user)
    })

    it('should throw an error when the user does not exist', async () => {
      userService.findOne.mockResolvedValueOnce(null)
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
      userService.findOne.mockResolvedValueOnce(user as UserEntity)
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
})
