import { Query, Resolver } from '@nestjs/graphql'

import { User as UserEntity } from './entities/user.entity'
import { UserRepository } from './user.repository'

@Resolver()
export class UserResolver {
  constructor(private readonly repo: UserRepository) {}

  @Query(() => [UserEntity])
  async getUsers(): Promise<UserEntity[]> {
    return this.repo.getUsers({}).then((users) => {
      return users.map((user) => new UserEntity(user))
    })
  }
}
