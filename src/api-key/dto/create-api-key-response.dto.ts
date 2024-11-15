import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator'

@ObjectType()
@Exclude()
export class CreateApiKeyResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the API Key',
    example: 1,
    type: 'integer',
    format: 'int32',
  })
  @Field(() => Int, {
    nullable: false,
    description: 'Unique identifier for the API Key',
  })
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
  @Field(() => String, {
    nullable: false,
    description: 'The name of the API Key',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string

  @ApiProperty({
    description: 'The API Key',
    example: 'dp-aldkhlkanlk,23.dflkj898798h23kbb3llk',
    type: 'string',
  })
  @Field(() => String, { nullable: false, description: 'The API Key' })
  @IsNotEmpty()
  @IsString()
  @Expose()
  key: string

  @ApiProperty({
    description: "The user's ID",
    example: 1,
    type: 'integer',
    format: 'int32',
  })
  @Field(() => Int, { nullable: false, description: "The user's ID" })
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
  @Field(() => GraphQLISODateTime, {
    nullable: false,
    description: 'DateTime the API Key expires at',
  })
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
  @Field(() => GraphQLISODateTime, {
    nullable: false,
    description: 'DateTime the API Key was created',
  })
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
  @Field(() => GraphQLISODateTime, {
    nullable: false,
    description: 'DateTime the API Key was last updated',
  })
  @IsNotEmpty()
  @IsDateString()
  @Expose()
  updatedAt: Date

  constructor(partial: Partial<CreateApiKeyResponseDto>) {
    Object.assign(this, partial)
  }
}
