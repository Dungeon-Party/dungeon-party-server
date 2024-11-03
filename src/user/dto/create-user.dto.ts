import { PickType } from '@nestjs/swagger'

import { User as UserEntity } from '../entities/user.entity'

export class CreateUserDto extends PickType(UserEntity, [
  'name',
  'username',
  'email',
  'password',
] as const) {}
