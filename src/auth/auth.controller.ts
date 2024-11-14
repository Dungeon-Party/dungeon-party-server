// TODO: Ensure that swagger description, response, and body is added to each method
// TODO: Inject logger and log any exceptions
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
import { GetUser } from '../user/decorators/user.decorator'
import { User } from '../user/entities/user.entity'
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
  login(@GetUser() user: User) {
    return this.authService.generateJwt(user)
  }

  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({ type: User })
  @Post('register')
  register(@Body() data: SignUpDto) {
    return this.authService.register(data)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refresh(@GetUser() user: User) {
    return this.authService.generateJwt(user)
  }

  @ApiBearerAuth()
  @ApiSecurity('api-key')
  @UseGuards(JwtOrApiKeyAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user: User) {
    return new User(user)
  }
}
