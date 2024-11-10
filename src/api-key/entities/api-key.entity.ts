// TODO: Ensure that swagger description is added to each field
// TODO: Class Validator is properly applied to each field
// TODO: GraphQL decorators are properly applied to each field
// TODO: Ensure that the class extends the Prisma model
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
