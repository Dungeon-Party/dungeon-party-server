import { Module } from '@nestjs/common'

import { ApiKeyController } from './api-key.controller'
import { ApiKeyService } from './api-key.service'
import { ApiKeyRepository } from './api-key.repository'

@Module({
  imports: [],
  controllers: [ApiKeyController],
  providers: [ApiKeyService, ApiKeyRepository],
  exports: [ApiKeyService, ApiKeyRepository], // FIXME: don't like exporting ApiKeyRepository
})
export class ApiKeyModule {}
