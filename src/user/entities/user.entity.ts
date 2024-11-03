import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { Exclude } from 'class-transformer'
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator'

@ObjectType()
export class UserEntity implements User {
  @ApiProperty()
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  id: number

  @ApiProperty()
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @Field(() => String)
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  username: string

  @Exclude()
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty()
  @Field(() => GraphQLISODateTime)
  @IsDateString()
  @IsNotEmpty()
  createdAt: Date

  @ApiProperty()
  @Field(() => GraphQLISODateTime)
  @IsDateString()
  @IsNotEmpty()
  updatedAt: Date

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
}
