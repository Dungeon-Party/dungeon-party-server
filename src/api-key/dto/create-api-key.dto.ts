import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

import { ApiKeyEntity } from '../entities/api-key.entity'

export class CreateApiKeyDto implements Partial<ApiKeyEntity> {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  userId: number

  constructor(partial: Partial<ApiKeyEntity>) {
    Object.assign(this, partial)
  }
}
