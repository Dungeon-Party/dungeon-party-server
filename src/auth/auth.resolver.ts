import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AuthService } from './auth.service'
import { User as UserEntity } from '../user/entities/user.entity'
import LoginDto from './dto/login.dto'
import { SignUpDto } from './dto/signup.dto'
import TokenResponseDto from './dto/token-response.dto'

@Resolver(() => TokenResponseDto)
export class AuthResolver {
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

  @Mutation(() => UserEntity)
  async register(
    @Args('registerInput') registerInput: SignUpDto,
  ): Promise<UserEntity> {
    return this.authService.register(registerInput)
  }

  // @Query(() => TokenResponseDto)
  // async refresh(): Promise<TokenResponseDto> {
  //   return this.authService.generateJwt()
  // }
}
