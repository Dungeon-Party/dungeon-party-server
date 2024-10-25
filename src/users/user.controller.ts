import { Controller, Get } from '@nestjs/common'
import { User } from '@prisma/client'

import { Logger } from '../common/winston/winston.service'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name)

  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    this.logger.info('Fetching all users')
    return this.userService.findAll({}).then((users) => {
      return users.map((user) => {
        delete user.password
        return user
      })
    })
  }
}
