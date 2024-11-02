import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { ApiKeyEntity } from 'src/api-key/entities/api-key.entity'

import { ApiKeyService } from '../api-key/api-key.service'
import { UserService } from '../user/user.service'
import { UserEntity } from '../user/entities/user.entity'
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
    const user = await this.userService.findUserByEmailOrUsername(
      username,
      username,
    )

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

    /* istanbul ignore next */
    const jwtSecret =
      process.env.NODE_ENV === 'test'
        ? 'test-secret'
        : this.configService.get<string>('security.jwt.secret')
    /* istanbul ignore next */
    const accessExpiresIn =
      process.env.NODE_ENV === 'test'
        ? '10m'
        : this.configService.get<string>('security.jwt.accessExpiresIn')
    /* istanbul ignore next */
    const refreshExpiresIn =
      process.env.NODE_ENV === 'test'
        ? '1d'
        : this.configService.get<string>('security.jwt.refreshExpiresIn')

    return new TokenResponseDto({
      accessToken: this.jwtService.sign(payload, {
        expiresIn: accessExpiresIn,
        secret: jwtSecret,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: refreshExpiresIn,
        secret: jwtSecret,
      }),
    })
  }

  async validateApiKey(key: string): Promise<UserEntity> {
    return this.apiKeyService
      .findValidApiKey(key)
      .then((apiKey: ApiKeyEntity) => {
        const apiKeyToVerify = apiKey.key.split('.')[1]
        if (argon2.verify(apiKeyToVerify, key.split('.')[1])) {
          return apiKey.userId
        }
      })
      .then((userId: UserEntity['id']) => {
        return this.userService.findUserById(userId)
      })
  }
}
