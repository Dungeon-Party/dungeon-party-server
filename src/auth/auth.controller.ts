import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { JwtOrApiKeyAuthGuard } from './guards/jwt-apiKey-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './auth.service'
import { BadRequestExceptionI, UnauthorizedExceptionI } from '../types'
import { GetUser } from '../user/decorators/user.decorator'
import { User } from '../user/entities/user.entity'
import { AuthMetaData } from './decorators/auth-metadata.decorator'
import LoginDto from './dto/login.dto'
import { SignUpDto } from './dto/signup.dto'
import TokenResponseDto from './dto/token-response.dto'

@ApiTags('auth')
@Controller('auth')
@AuthMetaData(`${JwtOrApiKeyAuthGuard.name}Skip`)
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name)

  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: TokenResponseDto, description: 'Login successful' })
  @ApiUnauthorizedResponse({
    type: UnauthorizedExceptionI,
    description: 'Invalid credentials',
  })
  @ApiBasicAuth()
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
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
    type: BadRequestExceptionI,
    description: 'Bad Request',
  })
  @Post('register')
  register(@Body() data: SignUpDto): Promise<User> {
    return this.authService.register(data)
  }

  @ApiOkResponse({ type: TokenResponseDto, description: 'Token refreshed' })
  @ApiUnauthorizedResponse({
    type: UnauthorizedExceptionI,
    description: 'Invalid credentials',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('refresh')
  refresh(@GetUser() user: User) {
    return this.authService.generateJwt(user)
  }
}
