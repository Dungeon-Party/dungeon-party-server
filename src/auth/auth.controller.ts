import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'

import { ApiKeyAuthGuard } from './guards/apikey-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './auth.service'
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
  login(@Request() req) {
    return this.authService.generateJwt(req.user)
  }

  // TODO: Implement signup

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refresh(@Request() req) {
    return this.authService.generateJwt(req.user)
  }

  @ApiBearerAuth()
  @ApiSecurity('api-key')
  @UseGuards(JwtAuthGuard, ApiKeyAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
