import { ApiProperty } from '@nestjs/swagger'
import { ApiKey } from '@prisma/client'

export class ApiKeyEntity implements ApiKey {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  key: string

  @ApiProperty()
  userId: number

  @ApiProperty()
  expiresAt: Date

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  constructor(partial: Partial<ApiKeyEntity>) {
    Object.assign(this, partial);
  }
}
