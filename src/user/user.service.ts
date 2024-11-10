// TODO: Inject logger and log any exceptions
// TODO: add JsDoc comments to all methods
// TODO: Ensure that all method names make sense (getAllApiKeysForUser vs getAllApiKeys)
import { Injectable, NotFoundException } from '@nestjs/common'
import * as argon2 from 'argon2'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User as UserEntity } from './entities/user.entity'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async createUser(data: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await argon2.hash(data.password, {
      type: argon2.argon2i,
    })

    return this.repo
      .create({
        data: {
          ...data,
          password: hashedPassword,
        },
      })
      .then((user) => {
        return new UserEntity(user)
      })
  }

  async findUserById(id: number): Promise<UserEntity | null> {
    return this.repo.findUnique({ where: { id } }).then((user) => {
      if (!user) {
        throw new NotFoundException('User not found')
      }
      return new UserEntity(user)
    })
  }

  async findUserByEmailOrUsername(
    userEmail: UserEntity['email'],
    userUsername: UserEntity['username'],
  ): Promise<UserEntity | null> {
    return this.repo
      .findFirst({
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
    return this.repo.findMany({}).then((users) => {
      return users.map((user) => new UserEntity(user))
    })
  }

  async updateUser(
    userId: UserEntity['id'],
    data: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.repo
      .update({
        where: { id: userId },
        data,
      })
      .then((user) => {
        return new UserEntity(user)
      })
  }

  async deleteUser(userId: UserEntity['id']): Promise<UserEntity> {
    return this.repo
      .delete({
        where: { id: userId },
      })
      .then((user) => {
        return new UserEntity(user)
      })
  }
}
