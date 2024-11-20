import { SetMetadata } from '@nestjs/common'

export const AUTH_METADATA_KEY = 'auth'
export const AuthMetaData = (...metadata: string[]) =>
  SetMetadata(AUTH_METADATA_KEY, metadata)
