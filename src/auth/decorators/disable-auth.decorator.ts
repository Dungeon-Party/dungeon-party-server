import { SetMetadata } from '@nestjs/common'

export const DISABLE_AUTH_KEY = 'isPublic'
export const DisableGlobalAuth = () => SetMetadata(DISABLE_AUTH_KEY, true)
