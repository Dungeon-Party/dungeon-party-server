import { Logger, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { JwtOrApiKeyAuthGuard } from './guards/jwt-apiKey-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AuthService } from './auth.service'
import { GetUser } from '../user/decorators/user.decorator'
import { User } from '../user/entities/user.entity'
import { AuthMetaData } from './decorators/auth-metadata.decorator'
import LoginDto from './dto/login.dto'
import { SignUpDto } from './dto/signup.dto'
import TokenResponseDto from './dto/token-response.dto'

@Resolver(() => TokenResponseDto)
@AuthMetaData(`${JwtOrApiKeyAuthGuard.name}Skip`)
export class AuthResolver {
  private readonly logger: Logger = new Logger(AuthResolver.name)

  constructor(private readonly authService: AuthService) {}

  @Query(() => TokenResponseDto)
  async login(
    @Args('loginInput') loginInput: LoginDto,
  ): Promise<TokenResponseDto> {
    return this.authService.login(
      loginInput['username'],
      loginInput['password'],
    )
  }

  @Mutation(() => User)
  async register(
    @Args('registerInput') registerInput: SignUpDto,
  ): Promise<User> {
    return this.authService.register(registerInput)
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => TokenResponseDto)
  async refresh(@GetUser() user: User): Promise<TokenResponseDto> {
    return this.authService.generateJwt(user)
  }
}
