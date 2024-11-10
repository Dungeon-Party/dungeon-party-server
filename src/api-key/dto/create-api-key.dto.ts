import { InputType, PickType } from '@nestjs/graphql'

import { ApiKeyEntity } from '../entities/api-key.entity'

@InputType()
export class CreateApiKeyDto extends PickType(
  ApiKeyEntity,
  ['name'] as const,
  InputType,
) {}
