// TODO: Ensure that swagger description is added to each field
// TODO: Class Validator is properly applied to each field
// TODO: GraphQL decorators are properly applied to each field
import { Field, ObjectType, OmitType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

import { ApiKeyEntity } from '../entities/api-key.entity'

@ObjectType()
export class CreateApiKeyResponseDto extends OmitType(
  ApiKeyEntity,
  ['key'],
  ObjectType,
) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  key: string

  constructor(partial: Partial<CreateApiKeyResponseDto>) {
    super(partial)
    Object.assign(this, partial)
  }
}
