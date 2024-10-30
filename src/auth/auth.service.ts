import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'

import { ApiKeyService } from '../api-key/api-key.service'
import { UserService } from '../users/user.service'
import { UserEntity } from '../users/entities/user.entity'
import JwtPayloadDto from './dto/jwt-payload.dto'
import TokenResponseDto from './dto/token-response.dto'

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private apiKeyService: ApiKeyService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserEntity | null> {
    const user = await this.userService.findOne({
      OR: [{ email: username }, { username: username }],
    })

    if (!user) {
      throw new NotFoundException('User not found')
    } else if (!(await argon2.verify(user.password, pass))) {
      throw new UnauthorizedException()
    }
    return user
  }

  async generateJwt(user: UserEntity): Promise<TokenResponseDto> {
    const payload: Partial<JwtPayloadDto> = {
      sub: user.id,
      iss: 'dungeon-party',
      username: user.username,
      email: user.email,
    }
    return new TokenResponseDto({
      accessToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>(
          'security.jwt.accessExpiresIn',
        ),
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>(
          'security.jwt.refreshExpiresIn',
        ),
      }),
    })
  }

  async validateApiKey(key: string): Promise<UserEntity> {
    return this.apiKeyService.findValidApiKey(key)
  }
}
