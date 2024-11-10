// TODO: Ensure that swagger description is added to each field
// TODO: Class Validator is properly applied to each field
// TODO: GraphQL decorators are properly applied to each field
import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

import { User } from '../entities/user.entity'

@InputType()
export class UpdateUserDto extends PartialType(
  OmitType(User, ['id', 'createdAt', 'updatedAt'] as const),
  InputType,
) {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  password?: User['password']
}
