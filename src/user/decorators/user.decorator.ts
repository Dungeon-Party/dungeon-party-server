import {
  ContextType,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const GetUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    let request
    if (context.getType<ContextType | 'graphql'>() === 'graphql') {
      request = GqlExecutionContext.create(context).getContext().req
    } else {
      request = context.switchToHttp().getRequest()
    }
    const user = request.user

    return data ? user?.[data as string] : user
  },
)
