import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
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

// TODO: Add logout endpoint
// TODO: Add refresh token endpoint
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
  signIn(@Request() req) {
    return this.authService.generateJwt(req.user)
  }

  @ApiBearerAuth()
  @ApiSecurity('api-key')
  @UseGuards(AuthGuard(['jwt', 'api-key']))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('api-key/create')
  async createApiKey(@Request() req, @Body() body: { name: string }) {
    return this.authService.generateApiKey(body.name, req.user)
  }
}
