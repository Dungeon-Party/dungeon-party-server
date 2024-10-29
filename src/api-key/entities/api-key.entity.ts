import { ApiProperty } from '@nestjs/swagger'
import { ApiKey } from '@prisma/client'
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ApiKeyEntity implements ApiKey {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  key: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  expiresAt: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  createdAt: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  updatedAt: Date

  constructor(partial: Partial<ApiKeyEntity>) {
    Object.assign(this, partial)
  }
}
