import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import JwtOrApiKeyAuthGuard from './guards/jwt-apiKey-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './auth.service'
import { BadRequestException, UnauthorizedException } from '../types'
import { GetUser } from '../user/decorators/user.decorator'
import { User } from '../user/entities/user.entity'
import LoginDto from './dto/login.dto'
import { SignUpDto } from './dto/signup.dto'
import TokenResponseDto from './dto/token-response.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly logger: Logger,
    private readonly authService: AuthService,
  ) {}

  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: TokenResponseDto, description: 'Login successful' })
  @ApiUnauthorizedResponse({
    type: UnauthorizedException,
    description: 'Invalid credentials',
  })
  @ApiBasicAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@GetUser() user: User): Promise<TokenResponseDto> {
    return this.authService.generateJwt(user)
  }

  @ApiBody({
    type: SignUpDto,
    description: 'Request object for creating a user',
  })
  @ApiOkResponse({ type: User, description: 'User created successfully' })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Bad Request',
  })
  @Post('register')
  register(@Body() data: SignUpDto): Promise<User> {
    return this.authService.register(data)
  }

  @ApiOkResponse({ type: TokenResponseDto, description: 'Token refreshed' })
  @ApiUnauthorizedResponse({
    type: UnauthorizedException,
    description: 'Invalid credentials',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refresh(@GetUser() user: User) {
    return this.authService.generateJwt(user)
  }

  @ApiOkResponse({ type: User, description: 'Profile retrieved successfully' })
  @ApiUnauthorizedResponse({
    type: UnauthorizedException,
    description: 'Invalid credentials',
  })
  @ApiBearerAuth()
  @ApiSecurity('api-key')
  @UseGuards(JwtOrApiKeyAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user: User) {
    return new User(user)
  }
}
