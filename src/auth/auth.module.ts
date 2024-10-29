import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { PrismaModule } from 'nestjs-prisma'

import { ApiKeyStrategy } from './strategies/apikey.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'
import { UserModule } from '../users/user.module'
import { AuthController } from './auth.controller'
import { ApiKeyService } from '../api-key/api-key.service'
import { AuthService } from './auth.service'

@Module({
  imports: [
    PrismaModule.forRoot(),
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('security.jwt.secret'),
        signOptions: { expiresIn: '10m' },
      }),
      inject: [ConfigService],
    }),
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
