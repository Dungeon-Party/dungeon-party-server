import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { utilities, WinstonModule } from 'nest-winston'
import { PrismaModule } from 'nestjs-prisma'
import { format, transports } from 'winston'

import { ApiKeyModule } from './api-key/api-key.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './users/user.module'
import databaseConfig from './config/database.config'
import httpConfig from './config/http.config'
import loggingConfig from './config/logging.config'
import securityConfig from './config/security.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [httpConfig, databaseConfig, securityConfig, loggingConfig],
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        level: configService.get<string>('logging.level'),
        format: format.combine(
          format.colorize(),
          format.timestamp(),
          format.ms(),
          utilities.format.nestLike(),
        ),
        transports: [new transports.Console()],
      }),
      inject: [ConfigService],
    }),
    PrismaModule.forRoot(),
    AuthModule,
    ApiKeyModule,
    UserModule,
  ],
})
export class AppModule {}
