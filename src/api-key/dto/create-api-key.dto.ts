import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

import { ApiKeyEntity } from '../entities/api-key.entity'

export class CreateApiKeyDto implements Partial<ApiKeyEntity> {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsNumber()
  userId: number
}
