// TODO: Ensure that swagger description is added to each field
// TODO: Class Validator is properly applied to each field
// TODO: GraphQL decorators are properly applied to each field
// TODO: Ensure that the class implements the Prisma model
import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { User as PrismaUser } from '@prisma/client'
import { Exclude } from 'class-transformer'
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator'

@ObjectType()
export class User implements PrismaUser {
  @ApiProperty()
  @Field(() => Int, { nullable: false })
  @IsNumber()
  @IsNotEmpty()
  id: number

  @ApiProperty()
  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @Field(() => String, { nullable: false })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @Field(() => String, { nullable: false })
  @IsString()
  @IsNotEmpty()
  username: string

  @Exclude()
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty()
  @Field(() => GraphQLISODateTime, { nullable: false })
  @IsDateString()
  @IsNotEmpty()
  createdAt: Date

  @ApiProperty()
  @Field(() => GraphQLISODateTime, { nullable: false })
  @IsDateString()
  @IsNotEmpty()
  updatedAt: Date

  constructor(partial: Partial<User>) {
    Object.assign(this, partial)
  }
}
