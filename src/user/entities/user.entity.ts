// TODO: Ensure that swagger description is added to each field
// TODO: Class Validator is properly applied to each field
// TODO: GraphQL decorators are properly applied to each field
// TODO: Ensure that the class implements the Prisma model
import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { User as PrismaUser } from '@prisma/client'
import { Exclude, Expose } from 'class-transformer'
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator'

import { ApiKey } from '../../api-key/entities/api-key.entity'

@ObjectType()
@Exclude()
export class User implements PrismaUser {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
    type: 'integer',
    format: 'int32',
  })
  @Field(() => Int, { nullable: false })
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  id: number

  @ApiProperty({
    description: "The user's name",
    minLength: 2,
    maxLength: 16,
    example: 'Test User',
    type: 'string',
    nullable: true,
  })
  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string

  @ApiProperty({
    description: "The user's email address",
    example: 'test@email.com',
    type: 'string',
  })
  @Field(() => String, { nullable: false })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string

  @ApiProperty({
    description: "The user's username",
    minLength: 4,
    maxLength: 16,
    example: 'testuser',
    type: 'string',
  })
  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  @Expose()
  username: string

  @ApiProperty({
    description: "The user's password",
    minLength: 8,
    maxLength: 30,
    example: 'testpassword',
    type: 'string',
  })
  @ApiHideProperty()
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    description: "The user's API Keys",
    type: () => ApiKey,
    isArray: true,
    required: false,
  })
  @ValidateNested({ each: true })
  apiKeys?: ApiKey[]

  @ApiProperty({
    description: 'DateTime the user was created',
    example: '2022-01-01T00:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @Field(() => GraphQLISODateTime, { nullable: false })
  @IsDateString()
  @IsNotEmpty()
  @Expose()
  createdAt: Date

  @ApiProperty({
    description: 'DateTime the user was last updated',
    example: '2022-01-01T00:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @Field(() => GraphQLISODateTime, { nullable: false })
  @IsDateString()
  @IsNotEmpty()
  @Expose()
  updatedAt: Date

  constructor(partial: Partial<User>) {
    Object.assign(this, partial)
  }
}
