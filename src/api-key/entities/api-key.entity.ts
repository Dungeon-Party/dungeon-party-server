// TODO: Ensure that swagger description is added to each field
// TODO: Class Validator is properly applied to each field
// TODO: GraphQL decorators are properly applied to each field
// TODO: Ensure that the class extends the Prisma model
import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { ApiKey } from '@prisma/client'
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator'

import { User } from '../../user/entities/user.entity'

@ObjectType()
export class ApiKeyEntity implements ApiKey {
  @ApiProperty({
    description: 'Unique identifier for the API Key',
    example: 1,
    type: 'integer',
    format: 'int32',
  })
  @Field(() => Int, { nullable: false })
  @IsNotEmpty()
  @IsNumber()
  id: number

  @ApiProperty({
    description: 'The name of the API Key',
    maxLength: 25,
    example: 'Test API Key',
    type: 'string',
  })
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'The API Key',
    example: 'dp-aldkhlkanlk,23.dflkj898798h23kbb3llk',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  key: string

  @ApiProperty({
    description: 'The user the API Key belongs to',
    type: () => User,
    required: false,
  })
  user?: User

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
  @Field(() => GraphQLISODateTime, { nullable: false })
  @IsNotEmpty()
  @IsDateString()
  expiresAt: Date

  @ApiProperty({
    description: 'DateTime the API Key was created',
    example: '2022-01-01T00:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @Field(() => GraphQLISODateTime, { nullable: false })
  @IsNotEmpty()
  @IsDateString()
  createdAt: Date

  @ApiProperty({
    description: 'DateTime the API Key was last updated',
    example: '2022-01-01T00:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @Field(() => GraphQLISODateTime, { nullable: false })
  @IsNotEmpty()
  @IsDateString()
  updatedAt: Date

  constructor(partial: Partial<ApiKeyEntity>) {
    Object.assign(this, partial)
  }
}
