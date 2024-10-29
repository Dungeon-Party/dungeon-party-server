import { ApiProperty } from '@nestjs/swagger'
import { ApiKey } from '@prisma/client'
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ApiKeyEntity implements ApiKey {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  id: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  key: string

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  userId: number

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  expiresAt: Date

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  createdAt: Date

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  updatedAt: Date

  constructor(partial: Partial<ApiKeyEntity>) {
    Object.assign(this, partial)
  }
}
