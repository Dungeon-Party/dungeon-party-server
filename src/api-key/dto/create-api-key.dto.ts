// TODO: Ensure that swagger description is added to each field
// TODO: Class Validator is properly applied to each field
// TODO: GraphQL decorators are properly applied to each field
import { InputType, PickType } from '@nestjs/graphql'

import { ApiKeyEntity } from '../entities/api-key.entity'

@InputType()
export class CreateApiKeyDto extends PickType(
  ApiKeyEntity,
  ['name'] as const,
  InputType,
) {}
