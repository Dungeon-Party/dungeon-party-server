import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'

import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './auth.service'
import { User } from '../decorators/user.decorator'
import { UserEntity } from '../users/entities/user.entity'
import LoginDto from './dto/login.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user: UserEntity) {
    return this.authService.generateJwt(user)
  }

  // TODO: Implement signup

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refresh(@User() user: UserEntity) {
    return this.authService.generateJwt(user)
  }

  @ApiBearerAuth()
  @ApiSecurity('api-key')
  @UseGuards(AuthGuard(['jwt', 'api-key']))
  @Get('profile')
  getProfile(@User() user: UserEntity) {
    return user
  }
}
