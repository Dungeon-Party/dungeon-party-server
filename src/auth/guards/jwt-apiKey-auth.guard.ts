import { ContextType, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

import { AUTH_METADATA_KEY } from '../decorators/auth-metadata.decorator'

@Injectable()
export class JwtOrApiKeyAuthGuard extends AuthGuard(['api-key', 'jwt']) {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  getRequest(context: ExecutionContext) {
    if (context.getType<ContextType | 'graphql'>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req
    } else {
      return context.switchToHttp().getRequest()
    }
  }

  canActivate(context: ExecutionContext) {
    const authMetadata = this.reflector.getAllAndOverride<string[]>(
      AUTH_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (authMetadata.includes(`${JwtOrApiKeyAuthGuard.name}Skip`)) {
      return true
    }

    return super.canActivate(context)
  }
}
