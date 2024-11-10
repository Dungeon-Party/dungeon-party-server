import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User as UserEntity } from './entities/user.entity'

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserEntity], { name: 'users' })
  async getUsers(): Promise<UserEntity[]> {
    return this.userService.getAllUsers()
  }

  @Query(() => UserEntity, { name: 'user', nullable: true })
  async getUserById(@Args('id') id: number): Promise<UserEntity | null> {
    return this.userService.findUserById(id)
  }

  @Mutation(() => UserEntity, { name: 'createUser' })
  async createUser(@Args('data') input: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(input)
  }

  @Mutation(() => UserEntity, { name: 'updateUser' })
  async updateUser(
    @Args('id') id: number,
    @Args('data') input: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateUser(id, input)
  }

  @Mutation(() => UserEntity, { name: 'deleteUser' })
  async deleteUser(@Args('id') id: number): Promise<UserEntity> {
    return this.userService.deleteUser(id)
  }
}
