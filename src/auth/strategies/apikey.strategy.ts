import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { HeaderAPIKeyStrategy } from 'passport-headerapikey'

import { AuthService } from '../auth.service'

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'api-key',
) {
  constructor(private readonly authService: AuthService) {
    super(
      { header: 'Authorization', prefix: 'Api-Key ' },
      true,
      async (apikey, done) => {
        const user = await authService.validateApiKey(apikey)
        if (!user) {
          done(new UnauthorizedException(), false)
        }
        return done(null, user)
      },
    )
  }
}
