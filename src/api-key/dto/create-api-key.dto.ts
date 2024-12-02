import { Field, InputType, Int } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

@InputType()
export class CreateApiKeyDto {
  @ApiProperty({
    description: 'The name of the API Key',
    minLength: 3,
    maxLength: 25,
    example: 'Test API Key',
    type: 'string',
    required: true,
  })
  @Field(() => String, {
    nullable: false,
    description: 'The name of the API Key',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  name: string

  @ApiProperty({
    description: "The user's ID",
    example: 1,
    type: 'integer',
    format: 'int32',
    required: true,
  })
  @Field(() => Int, { nullable: false })
  @IsNotEmpty()
  @IsNumber()
  userId: number

  constructor(partial: Partial<CreateApiKeyDto>) {
    Object.assign(this, partial)
  }
}
