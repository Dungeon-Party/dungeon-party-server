import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import { mockDeep } from 'jest-mock-extended'

import { UserModule } from '../users/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthController', () => {
  let controller: AuthController

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
      .compile()

    controller = module.get(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('login', () => {
    it.todo('should return an access token and a refresh token')

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
