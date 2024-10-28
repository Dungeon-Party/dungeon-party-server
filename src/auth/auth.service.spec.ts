import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import { mockDeep } from 'jest-mock-extended'

import { UserModule } from '../users/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let service: AuthService

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

    service = module.get(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('validateUser', () => {
    it.todo('should return a user when the credentials are valid')

    it.todo('should throw an error when the user does not exist')

    it.todo('should throw an error when the password is incorrect')
  })

  describe('generateJwt', () => {
    it.todo('should return an access token and a refresh token')

    it.todo('should include the user information in the payload')

    it.todo('should expire the access token in 1 hour')

    it.todo('should expire the refresh token in 7 days')
  })
})
