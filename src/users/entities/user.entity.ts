import { ApiProperty } from '@nestjs/swagger'
import { User } from '@prisma/client'

export class UserEntity implements User {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  username: string

  password: string

  apiKey: number

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
