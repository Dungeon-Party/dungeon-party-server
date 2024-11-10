import { Module } from '@nestjs/common'

import { ApiKeyController } from './api-key.controller'
import { ApiKeyService } from './api-key.service'
import { ApiKeyRepository } from './api-key.repository'
import { ApiKeyResolver } from './api-key.resolver'

@Module({
  imports: [],
  controllers: [ApiKeyController],
  providers: [ApiKeyService, ApiKeyResolver, ApiKeyRepository],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}
