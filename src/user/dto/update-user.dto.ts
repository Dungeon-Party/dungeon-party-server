import { OmitType } from '@nestjs/swagger'

import { UserEntity } from '../entities/user.entity'

export class UpdateUserDto extends OmitType(UserEntity, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
