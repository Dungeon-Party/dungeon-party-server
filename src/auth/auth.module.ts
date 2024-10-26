import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { ApiKeyStrategy } from './strategies/apikey.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'
import { UserModule } from '../users/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ApiKeyService } from '../api-key/api-key.service'

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10m' },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ApiKeyService, LocalStrategy, JwtStrategy, ApiKeyStrategy],
  exports: [AuthService],
})
export class AuthModule {}
