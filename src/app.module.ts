import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ApiKeyModule } from './api-key/api-key.module'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './common/prisma/prisma.module'
import { WinstonModule } from './common/winston/winston.module'
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
    WinstonModule,
    PrismaModule,
    AuthModule,
    UserModule,
    ApiKeyModule,
  ],
})
export class AppModule {}
