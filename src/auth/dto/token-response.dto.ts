// TODO: Ensure that swagger description is added to each field
// TODO: Class Validator is properly applied to each field
// TODO: GraphQL decorators are properly applied to each field
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
