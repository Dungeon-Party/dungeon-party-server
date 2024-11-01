import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

import { ApiKeyEntity } from '../entities/api-key.entity'

export class CreateApiKeyDto implements Partial<ApiKeyEntity> {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string

  constructor(partial: Partial<ApiKeyEntity>) {
    Object.assign(this, partial)
  }
}
