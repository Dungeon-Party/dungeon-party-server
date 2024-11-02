import { PickType } from '@nestjs/swagger'

import { ApiKeyEntity } from '../entities/api-key.entity'

export class CreateApiKeyDto extends PickType(ApiKeyEntity, [
  'name',
] as const) {}
