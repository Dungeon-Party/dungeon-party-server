// TODO: Ensure that swagger description is added to each field
// TODO: Class Validator is properly applied to each field
// TODO: GraphQL decorators are properly applied to each field
import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class SignUpDto {
  @ApiProperty()
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  passwordConfirmation: string

  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  constructor(partial: Partial<SignUpDto>) {
    Object.assign(this, partial)
  }
}
