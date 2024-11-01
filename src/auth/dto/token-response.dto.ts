import { ApiProperty } from '@nestjs/swagger'

export default class TokenResponseDto {
  @ApiProperty()
  accessToken: string

  @ApiProperty()
  refreshToken: string

  constructor(partial: Partial<TokenResponseDto>) {
    Object.assign(this, partial)
  }
}
