import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export default class JwtOrApiKeyAuthGuard extends AuthGuard([
  'api-key',
  'jwt',
]) {}
