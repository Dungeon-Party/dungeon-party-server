import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'

import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './auth.service'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
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
  login(@Request() req) {
    return this.authService.generateJwt(req.user)
  }

  // TODO: Implement signup

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  refresh(@Request() req) {
    return this.authService.generateJwt(req.user)
  }

  @ApiBearerAuth()
  @ApiSecurity('api-key')
  @UseGuards(AuthGuard(['jwt', 'api-key']))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
