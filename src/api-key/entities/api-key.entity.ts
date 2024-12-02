// TODO: Ensure that swagger description is added to each field
// TODO: Class Validator is properly applied to each field
// TODO: GraphQL decorators are properly applied to each field
// TODO: Ensure that the class extends the Prisma model
import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { ApiKey as PrismaApiKey } from '@prisma/client'
import { Exclude, Expose } from 'class-transformer'
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { Mock } from 'mockingbird'

@ObjectType()
@Exclude()
export class ApiKey implements PrismaApiKey {
  @ApiProperty({
    description: 'Unique identifier for the API Key',
    example: 1,
    type: 'integer',
    format: 'int32',
  })
  @Field(() => Int, { nullable: false })
  @Mock((faker) => faker.datatype.number(1000))
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id: number

  @ApiProperty({
    description: 'The name of the API Key',
    minLength: 3,
    maxLength: 25,
    example: 'Test API Key',
    type: 'string',
  })
  @Field(() => String, { nullable: false })
  @Mock((faker) => faker.lorem.words(2))
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @Expose()
  name: string

  @ApiHideProperty()
  @Mock((faker) => faker.random.alphaNumeric(32))
  @IsNotEmpty()
  @IsString()
  key: string

  @ApiProperty({
    description: "The user's ID",
    example: 1,
    type: 'integer',
    format: 'int32',
  })
  @Field(() => Int, { nullable: false })
  @Mock((faker) => faker.datatype.number(1000))
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  userId: number

  @ApiProperty({
    description: 'DateTime the API Key expires at',
    example: '2022-01-01T00:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @Field(() => GraphQLISODateTime, { nullable: false })
  @Mock((faker) => faker.date.future())
  @IsNotEmpty()
  @IsDateString()
  @Expose()
  expiresAt: Date

  @ApiProperty({
    description: 'DateTime the API Key was created',
    example: '2022-01-01T00:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @Field(() => GraphQLISODateTime, { nullable: false })
  @Mock((faker) => faker.date.past())
  @IsNotEmpty()
  @IsDateString()
  @Expose()
  createdAt: Date

  @ApiProperty({
    description: 'DateTime the API Key was last updated',
    example: '2022-01-01T00:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @Field(() => GraphQLISODateTime, { nullable: false })
  @Mock((faker) => faker.date.recent())
  @IsNotEmpty()
  @IsDateString()
  @Expose()
  updatedAt: Date

  constructor(partial: Partial<ApiKey>) {
    Object.assign(this, partial)
  }
}
