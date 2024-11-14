// TODO: Ensure that swagger description is added to each field
// TODO: Class Validator is properly applied to each field
// TODO: GraphQL decorators are properly applied to each field
import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsDateString,
  IsNotEmpty,
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
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  name: string

  @ApiProperty({
    description: 'DateTime the API Key expires at',
    example: '2022-01-01T00:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @Field(() => GraphQLISODateTime, { nullable: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date

  constructor(partial: Partial<CreateApiKeyDto>) {
    Object.assign(this, partial)
  }
}
