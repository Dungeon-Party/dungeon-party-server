// TODO: Ensure that all necessary methods have guards
import { Logger } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly logger: Logger,
    private readonly userService: UserService,
  ) {}

  @Query(() => [User], { name: 'users' })
  async getUsers(): Promise<User[]> {
    return this.userService.getAllUsers()
  }

  @Query(() => User, { name: 'user', nullable: true })
  async getUserById(@Args('id') id: number): Promise<User | null> {
    return this.userService.findUserById(id)
  }

  @Mutation(() => User, { name: 'createUser' })
  async createUser(@Args('data') input: CreateUserDto): Promise<User> {
    return this.userService.createUser(input)
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('id') id: number,
    @Args('data') input: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, input)
  }

  @Mutation(() => User, { name: 'deleteUser' })
  async deleteUser(@Args('id') id: number): Promise<User> {
    return this.userService.deleteUser(id)
  }
}
