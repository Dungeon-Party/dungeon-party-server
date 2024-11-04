import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { Exclude } from 'class-transformer'
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator'

export class UserEntity implements User {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty()
  @IsEnum({ ADMIN: 'ADMIN', USER: 'USER' })
  @IsNotEmpty()
  role: 'ADMIN' | 'USER'

  @Exclude()
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  createdAt: Date

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  updatedAt: Date

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
}
