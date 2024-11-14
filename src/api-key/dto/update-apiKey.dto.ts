import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

@InputType()
export class UpdateApiKeyDto {
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

  constructor(partial: Partial<UpdateApiKeyDto>) {
    Object.assign(this, partial)
  }
}
