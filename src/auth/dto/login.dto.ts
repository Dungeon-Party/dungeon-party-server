import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export default class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  @ApiProperty()
  username: string

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  @ApiProperty()
  password: string

  constructor(partial: Partial<LoginDto>) {
    Object.assign(this, partial)
  }
}
