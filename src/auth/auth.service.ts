import { randomBytes } from 'crypto'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ApiKey, User } from '@prisma/client'
import * as argon2 from 'argon2'

import { UserService } from '../users/user.service'
import { PrismaService } from 'src/common/prisma/prisma.service'

// TODO: Add logout logic
// TODO: Add refresh token logic
// TODO: Salt the api token
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

  async deleteRefreshToken(user: User) {
    return this.userService
      .updateUser({
        where: { id: user.id },
        data: { refreshToken: null },
      })
      .then(() => {
        return { message: 'Refresh token deleted' }
      })
  }

  async refreshToken(user: User) {
    return this.generateJwt(user)
  }

  async validateApiKey(key: string): Promise<Partial<User>> {
    return this.userService.findValidApiKey(key)
  }

  async generateApiKey(keyName: string, user: User): Promise<Partial<ApiKey>> {
    const apiKeyString = 'dp-' + randomBytes(16).toString('hex')
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 7)

    return await this.prisma.apiKey.create({
      data: {
        name: keyName,
        key: apiKeyString,
        expiresAt: expirationDate.toISOString(),
        userId: user.id,
      },
      select: {
        name: true,
        key: true,
        expiresAt: true,
      },
    })
  }
}
