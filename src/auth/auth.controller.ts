import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'

import JwtOrApiKeyAuthGuard from './guards/jwt-apiKey-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './auth.service'
import { User } from '../user/decorators/user.decorator'
import { User as UserEntity } from '../user/entities/user.entity'
import LoginDto from './dto/login.dto'
import { SignUpDto } from './dto/signup.dto'
import TokenResponseDto from './dto/token-response.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: TokenResponseDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user: UserEntity) {
    return this.authService.generateJwt(user)
  }

  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({ type: UserEntity })
  @Post('register')
  register(@Body() data: SignUpDto) {
    return this.authService.register(data)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refresh(@User() user: UserEntity) {
    return this.authService.generateJwt(user)
  }

  @ApiBearerAuth()
  @ApiSecurity('api-key')
  @UseGuards(JwtOrApiKeyAuthGuard)
  @Get('profile')
  getProfile(@User() user: UserEntity) {
    return new UserEntity(user)
  }
}
