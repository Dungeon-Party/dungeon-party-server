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

  getContext(
    context: ExecutionContext,
  ): ExecutionContext | GqlExecutionContext {
    if (context.getType<ContextType | 'graphql'>() === 'graphql') {
      return GqlExecutionContext.create(context)
    } else {
      return context
    }
  }

  getRequest(context: ExecutionContext) {
    if (context.getType<ContextType | 'graphql'>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req
    } else {
      return context.switchToHttp().getRequest()
    }
  }

  canActivate(context: ExecutionContext) {
    const ctx: ExecutionContext | GqlExecutionContext = this.getContext(context)

    const authMetadata = this.reflector.getAllAndOverride<string[]>(
      AUTH_METADATA_KEY,
      [ctx.getHandler(), ctx.getClass()],
    )

    console.log(authMetadata)

    if (
      authMetadata &&
      authMetadata.includes(`${JwtOrApiKeyAuthGuard.name}Skip`)
    ) {
      return true
    }

    return super.canActivate(ctx)
  }
}
