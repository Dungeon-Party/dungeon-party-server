import { Injectable, NotFoundException } from '@nestjs/common'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async createUser(data: CreateUserDto): Promise<UserEntity> {
    return this.repo
      .createUser({
        data,
      })
      .then((user) => {
        return new UserEntity(user)
      })
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return this.repo.getUser({ where: { id } }).then((user) => {
      return new UserEntity(user)
    })
  }

  async findUserByEmailOrUsername(
    userEmail: UserEntity['email'],
    userUsername: UserEntity['username'],
  ): Promise<UserEntity | null> {
    return this.repo
      .findUser({
        where: { OR: [{ email: userEmail }, { username: userUsername }] },
      })
      .then((user) => {
        if (!user) {
          throw new NotFoundException('User not found')
        }
        return new UserEntity(user)
      })
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.repo.getUsers({}).then((users) => {
      return users.map((user) => new UserEntity(user))
    })
  }

  async updateUser(
    userId: UserEntity['id'],
    data: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.repo
      .updateUser({
        where: { id: userId },
        data,
      })
      .then((user) => {
        return new UserEntity(user)
      })
  }

  async deleteUser(userId: UserEntity['id']): Promise<UserEntity> {
    return this.repo
      .deleteUser({
        where: { id: userId },
      })
      .then((user) => {
        return new UserEntity(user)
      })
  }
}
