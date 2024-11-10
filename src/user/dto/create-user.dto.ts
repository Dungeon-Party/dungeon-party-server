// TODO: Ensure that swagger description is added to each field
// TODO: Class Validator is properly applied to each field
// TODO: GraphQL decorators are properly applied to each field
import { Field, InputType, PickType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

import { User } from '../entities/user.entity'

@InputType()
export class CreateUserDto extends PickType(
  User,
  ['name', 'username', 'email'] as const,
  InputType,
) {
  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  password: User['password']
}
