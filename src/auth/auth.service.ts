import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import * as argon2 from 'argon2'

import { ApiKeyService } from '../api-key/api-key.service'
import { UserService } from '../users/user.service'

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
  ): Promise<Partial<User> | null> {
    const user = await this.userService.findOne({
      OR: [{ email: username }, { username: username }],
    })

    if (!user || !(await argon2.verify(user.password, pass))) {
      throw new UnauthorizedException()
    }
    delete user.password
    return user
  }

  async generateJwt(user: User) {
    const payload = {
      sub: user.id,
      iss: 'dungeon-party',
      username: user.username,
      email: user.email,
    }
    return {
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
    }
  }

  async validateApiKey(key: string): Promise<Partial<User>> {
    return this.apiKeyService.findValidApiKey(key)
  }
}
