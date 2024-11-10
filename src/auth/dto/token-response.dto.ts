import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

@ObjectType()
export default class TokenResponseDto {
  @ApiProperty()
  @Field(() => String)
  accessToken: string

  @ApiProperty()
  @Field(() => String)
  refreshToken: string

  constructor(partial: Partial<TokenResponseDto>) {
    Object.assign(this, partial)
  }
}
