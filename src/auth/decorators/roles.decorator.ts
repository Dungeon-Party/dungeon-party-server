import { SetMetadata } from '@nestjs/common'

import { ROLES_KEY, UserRole } from '../../types'

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)
