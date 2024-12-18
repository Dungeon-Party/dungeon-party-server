// TODO: Ensure that swagger description is added to each field
// TODO: Class Validator is properly applied to each field
// TODO: GraphQL decorators are properly applied to each field
// TODO: Ensure that the class implements the Prisma model
import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { User as PrismaUser, UserRole } from '@prisma/client'
import { Exclude, Expose } from 'class-transformer'
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator'
import { Mock } from 'mockingbird'

@ObjectType()
@Exclude()
export class User implements PrismaUser {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
    type: 'integer',
    format: 'int32',
  })
  @Field(() => Int, {
    nullable: false,
    description: 'Unique identifier for the user',
  })
  @Mock((faker) => faker.datatype.number(1000))
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
  @Field(() => String, { nullable: false, description: "The user's name" })
  @Mock((faker) => faker.name.findName())
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string

  @ApiProperty({
    description: "The user's email address",
    example: 'test@email.com',
    type: 'string',
  })
  @Field(() => String, {
    nullable: false,
    description: "The user's email address",
  })
  @Mock((faker) => faker.internet.email())
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
  @Field(() => String, { nullable: false, description: "The user's username" })
  @Mock((faker) => faker.internet.userName())
  @IsString()
  @IsNotEmpty()
  @Expose()
  username: string

  @ApiHideProperty()
  @Mock((faker) => faker.internet.password())
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    description: "The user's role",
    enum: UserRole,
    example: 'USER',
  })
  @Field(() => String, { nullable: false, description: 'The user role' })
  @Mock((faker) => faker.random.arrayElement(Object.values(UserRole)))
  @IsString()
  @IsNotEmpty()
  @Expose()
  role: UserRole

  @ApiProperty({
    description: 'DateTime the user was created',
    example: '2022-01-01T00:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @Field(() => GraphQLISODateTime, {
    nullable: false,
    description: 'DateTime the user was created',
  })
  @Mock((faker) => faker.date.past())
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
  @Field(() => GraphQLISODateTime, {
    nullable: false,
    description: 'DateTime the user was last updated',
  })
  @Mock((faker) => faker.date.recent())
  @IsDateString()
  @IsNotEmpty()
  @Expose()
  updatedAt: Date

  constructor(partial: Partial<User>) {
    Object.assign(this, partial)
  }
}
