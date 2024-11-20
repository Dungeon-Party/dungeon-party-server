import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
  })
  @Field(() => Int, { nullable: false })
  @IsNotEmpty()
  @IsNumber()
  userId: number

  @ApiProperty({
    description: 'DateTime the API Key expires at',
    example: '2022-01-01T00:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @Field(() => GraphQLISODateTime, {
    nullable: false,
    description: 'DateTime the API Key expires at',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date

  constructor(partial: Partial<CreateApiKeyDto>) {
    Object.assign(this, partial)
  }
}
