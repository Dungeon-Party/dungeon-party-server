import { Module } from '@nestjs/common'

import { ApiKeyModule } from './api-key/api-key.module'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './common/prisma/prisma.module'
import { WinstonModule } from './common/winston/winston.module'
import { SystemModule } from './systems/system.module'
import { UserModule } from './users/user.module'

@Module({
  imports: [
    WinstonModule,
    PrismaModule,
    AuthModule,
    UserModule,
    SystemModule,
    ApiKeyModule,
  ],
})
export class AppModule {}
