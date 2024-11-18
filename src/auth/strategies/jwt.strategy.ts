import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UserService } from '../../user/user.service'
import { User } from '../../user/entities/user.entity'
import JwtPayloadDto from '../dto/jwt-payload.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        // FIXME: This is a workaround to make tests pass
        process.env.NODE_ENV === 'test'
          ? 'test-secret'
          : configService.get<string>('security.jwt.secret'),
    })
  }

  validate(payload: JwtPayloadDto): Promise<User> {
    return this.userService.findUserById(payload.sub)
  }
}
