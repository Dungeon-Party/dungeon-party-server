import { Logger, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { ApiKeyStrategy } from './strategies/apikey.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'
import { ApiKeyModule } from '../api-key/api-key.module'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'

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
    ApiKeyModule,
  ],
  controllers: [AuthController],
  providers: [
    Logger,
    AuthService,
    AuthResolver,
    LocalStrategy,
    JwtStrategy,
    ApiKeyStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
