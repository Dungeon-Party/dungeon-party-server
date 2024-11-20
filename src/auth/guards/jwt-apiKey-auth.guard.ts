import { ContextType, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

import { DISABLE_AUTH_KEY } from '../decorators/disable-auth.decorator'

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
    const disableAuth = this.reflector.get<boolean>(
      DISABLE_AUTH_KEY,
      context.getHandler(),
    )

    if (disableAuth) {
      return true
    }

    return super.canActivate(context)
  }
}
