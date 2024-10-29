import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export default class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string

  constructor(partial: Partial<LoginDto>) {
    Object.assign(this, partial)
  }
}
