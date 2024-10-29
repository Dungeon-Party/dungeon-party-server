import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import JwtPayloadDto from '../dto/jwt-payload.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('security.jwt.secret'),
    })
  }

  validate(payload: JwtPayloadDto): JwtPayloadDto {
    return new JwtPayloadDto(payload)
  }
}
