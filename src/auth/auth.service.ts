import { randomBytes } from 'crypto'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiKey, User } from '@prisma/client'
import * as argon2 from 'argon2'

import { PrismaService } from '../common/prisma/prisma.service'
import { UserService } from '../users/user.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
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
      accessToken: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    }
  }

  async validateApiKey(key: string): Promise<Partial<User>> {
    return this.userService.findValidApiKey(key)
  }

  async generateApiKey(user: User, keyName: string): Promise<Partial<ApiKey>> {
    const apiKeyPrefix = randomBytes(10).toString('hex')
    const apiKeyString = randomBytes(16).toString('hex')
    const apiKeyStringHashed = await argon2.hash(apiKeyString, {
      type: argon2.argon2i,
    })
    const apiKeyRaw = `dp-${apiKeyPrefix}.${apiKeyString}`
    const apiKeyHashed = `dp-${apiKeyPrefix}.${apiKeyStringHashed}`
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 7)

    return this.prisma.apiKey
      .create({
        data: {
          name: keyName,
          key: apiKeyHashed,
          expiresAt: expirationDate.toISOString(),
          userId: user.id,
        },
        select: {
          name: true,
          expiresAt: true,
        },
      })
      .then((apiKey) => {
        return {
          ...apiKey,
          key: apiKeyRaw,
        }
      })
  }
}
