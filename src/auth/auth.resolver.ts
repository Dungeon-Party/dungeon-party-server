// TODO: Ensure that all necessary methods have guards
import { Logger, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { GqlJwtAuthGuard } from './guards/gql-jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './auth.service'
import { GqlUser } from '../user/decorators/gql-user.decorator'
import { User } from '../user/entities/user.entity'
import LoginDto from './dto/login.dto'
import { SignUpDto } from './dto/signup.dto'
import TokenResponseDto from './dto/token-response.dto'

@Resolver(() => TokenResponseDto)
export class AuthResolver {
  constructor(
    private readonly logger: Logger,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
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

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => TokenResponseDto)
  async refresh(@GqlUser() user: User): Promise<TokenResponseDto> {
    return this.authService.generateJwt(user)
  }
}
