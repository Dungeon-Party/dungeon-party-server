import { Module } from '@nestjs/common'
import { PrismaModule } from 'nestjs-prisma'

import { ApiKeyController } from './api-key.controller'
import { ApiKeyService } from './api-key.service'

@Module({
  imports: [PrismaModule.forRoot()],
  controllers: [ApiKeyController],
  providers: [ApiKeyService],
})
export class ApiKeyModule {}
