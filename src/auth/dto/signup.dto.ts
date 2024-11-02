import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignUpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  passwordConfirmation: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  constructor(partial: Partial<SignUpDto>) {
    Object.assign(this, partial)
  }
}
