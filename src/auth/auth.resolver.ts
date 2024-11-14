// TODO: Ensure that all necessary methods have guards
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { GqlJwtAuthGuard } from './guards/gql-jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './auth.service'
import { GqlUser } from '../user/decorators/gql-user.decorator'
import { User as UserEntity } from '../user/entities/user.entity'
import LoginDto from './dto/login.dto'
import { SignUpDto } from './dto/signup.dto'
import TokenResponseDto from './dto/token-response.dto'

@Resolver(() => TokenResponseDto)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

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

  @Mutation(() => UserEntity)
  async register(
    @Args('registerInput') registerInput: SignUpDto,
  ): Promise<UserEntity> {
    return this.authService.register(registerInput)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => TokenResponseDto)
  async refresh(@GqlUser() user: UserEntity): Promise<TokenResponseDto> {
    return this.authService.generateJwt(user)
  }
}