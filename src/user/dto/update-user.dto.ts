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
