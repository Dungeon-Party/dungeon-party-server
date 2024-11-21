import { applyDecorators, SetMetadata } from '@nestjs/common'
import { Extensions } from '@nestjs/graphql'

export const AUTH_METADATA_KEY = 'test'
export const AuthMetaData = (...metadata: string[]) =>
  applyDecorators(
    SetMetadata(AUTH_METADATA_KEY, metadata),
    Extensions({ [AUTH_METADATA_KEY]: metadata.join(',') }),
  )
