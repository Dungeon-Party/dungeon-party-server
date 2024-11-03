import { OmitType, PartialType } from '@nestjs/swagger'

import { User as UserEntity } from '../entities/user.entity'

export class UpdateUserDto extends PartialType(
  OmitType(UserEntity, ['id', 'createdAt', 'updatedAt'] as const),
) {}
