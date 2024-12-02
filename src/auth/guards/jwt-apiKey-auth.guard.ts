import {
  ContextType,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

import { AUTH_METADATA_KEY } from '../decorators/auth-metadata.decorator'

@Injectable()
export class JwtOrApiKeyAuthGuard extends AuthGuard(['api-key', 'jwt']) {
  private readonly logger: Logger = new Logger(JwtOrApiKeyAuthGuard.name)

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

    if (
      authMetadata &&
      authMetadata.includes(`${JwtOrApiKeyAuthGuard.name}Skip`)
    ) {
      this.logger.debug(`Skipping ${JwtOrApiKeyAuthGuard.name}`)
      return true
    }

    return super.canActivate(ctx)
  }
}
