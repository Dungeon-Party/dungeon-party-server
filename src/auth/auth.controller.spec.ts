import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import { mockDeep } from 'jest-mock-extended'

import { ApiKeyStrategy } from './strategies/apikey.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'
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
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '10m' },
        }),
        PassportModule,
      ],
      controllers: [
        AuthController,
        AuthService,
        LocalStrategy,
        JwtStrategy,
        ApiKeyStrategy,
      ],
      providers: [AuthService],
    })
      .useMocker(mockDeep)
      .compile()

    controller = module.get(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
