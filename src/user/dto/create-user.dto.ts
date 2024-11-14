// TODO: Ensure that swagger description is added to each field
// TODO: Class Validator is properly applied to each field
// TODO: GraphQL decorators are properly applied to each field
import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

@InputType()
export class CreateUserDto {
  @ApiProperty({
    description: "The user's email address",
    example: 'test@email.com',
    type: 'string',
  })
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  email: string

  @ApiProperty({
    description: "The user's username",
    minLength: 4,
    maxLength: 16,
    example: 'testuser',
    type: 'string',
  })
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  username: string

  @ApiProperty({
    description: "The user's name",
    minLength: 2,
    maxLength: 16,
    example: 'Test User',
    type: 'string',
    required: false,
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  name?: string | null

  @ApiProperty({
    description: "The user's password",
    minLength: 8,
    maxLength: 30,
    example: 'testpassword',
    type: 'string',
  })
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  password: string

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial)
  }
}
