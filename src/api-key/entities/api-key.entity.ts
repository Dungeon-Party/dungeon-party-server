import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { ApiKey } from '@prisma/client'
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator'

@ObjectType()
export class ApiKeyEntity implements ApiKey {
  @ApiProperty()
  @Field(() => Int, { nullable: false })
  @IsNotEmpty()
  @IsNumber()
  id: number

  @ApiProperty()
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  @IsString()
  @ApiProperty()
  key: string

  @ApiProperty()
  @Field(() => String, { nullable: false })
  @IsNotEmpty()
  @IsNumber()
  userId: number

  @ApiProperty()
  @Field(() => GraphQLISODateTime, { nullable: false })
  @IsNotEmpty()
  @IsDateString()
  expiresAt: Date

  @ApiProperty()
  @Field(() => GraphQLISODateTime, { nullable: false })
  @IsNotEmpty()
  @IsDateString()
  createdAt: Date

  @ApiProperty()
  @Field(() => GraphQLISODateTime, { nullable: false })
  @IsNotEmpty()
  @IsDateString()
  updatedAt: Date

  constructor(partial: Partial<ApiKeyEntity>) {
    Object.assign(this, partial)
  }
}
