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
