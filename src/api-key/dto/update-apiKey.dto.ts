import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

@InputType()
export class UpdateApiKeyDto {
  @ApiProperty({
    description: 'The name of the API Key',
    maxLength: 25,
    example: 'Test API Key',
    type: 'string',
  })
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  name: string
}
