import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { ApiKeyStrategy } from './strategies/apikey.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'
import { UserModule } from '../users/user.module'
import { AuthController } from './auth.controller'
import { ApiKeyService } from '../api-key/api-key.service'
import { AuthService } from './auth.service'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('security.jwt.secret'),
        signOptions: {
          expiresIn: config.get<string>('security.jwt.accessExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ApiKeyService,
    LocalStrategy,
    JwtStrategy,
    ApiKeyStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
