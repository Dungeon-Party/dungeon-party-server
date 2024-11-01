import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { UserService } from '../../users/user.service'
import { UserEntity } from '../../users/entities/user.entity'
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
        process.env.NODE_ENV === 'test'
          ? 'test-secret'
          : configService.get<string>('security.jwt.secret'),
    })
  }

  validate(payload: JwtPayloadDto): Promise<UserEntity> {
    return this.userService.findOne({ id: payload.sub })
  }
}
