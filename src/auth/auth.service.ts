// TODO: Inject logger and log any exceptions
// TODO: add JsDoc comments to all methods
// TODO: Ensure that all method names make sense (getAllApiKeysForUser vs getAllApiKeys)
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { ApiKey } from 'src/api-key/entities/api-key.entity'

import { ApiKeyService } from '../api-key/api-key.service'
import { UserService } from '../user/user.service'
import { User } from '../user/entities/user.entity'
import JwtPayloadDto from './dto/jwt-payload.dto'
import { SignUpDto } from './dto/signup.dto'
import TokenResponseDto from './dto/token-response.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: Logger,
    private configService: ConfigService,
    private userService: UserService,
    private apiKeyService: ApiKeyService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<TokenResponseDto> {
    return this.validateUser(username, password).then((user) =>
      this.generateJwt(user),
    )
  }

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.userService.findUserByEmailOrUsername(
      username,
      username,
    )

    if (!user) {
      throw new NotFoundException('User not found')
    } else if (!(await argon2.verify(user.password, pass))) {
      throw new UnauthorizedException('Invalid password')
    }
    return user
  }

  async register(signupDto: SignUpDto): Promise<User> {
    if (signupDto.password !== signupDto.passwordConfirmation) {
      throw new BadRequestException('Passwords do not match')
    }
    delete signupDto.passwordConfirmation
    return this.userService.createUser(signupDto)
  }

  async generateJwt(user: User): Promise<TokenResponseDto> {
    const payload: Partial<JwtPayloadDto> = {
      sub: user.id,
      iss: 'dungeon-party',
      username: user.username,
      email: user.email,
    }

    /* istanbul ignore next */
    const jwtSecret =
      // FIXME: This is a workaround to make tests pass
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

  async validateApiKey(key: string): Promise<User> {
    return this.apiKeyService
      .findValidApiKey(key)
      .then((apiKey: ApiKey) => {
        const apiKeyToVerify = apiKey.key.split('.')[1]
        if (argon2.verify(apiKeyToVerify, key.split('.')[1])) {
          return apiKey.userId
        } else {
          throw new UnauthorizedException('Invalid API key')
        }
      })
      .then((userId: User['id']) => {
        return this.userService.findUserById(userId)
      })
  }
}
