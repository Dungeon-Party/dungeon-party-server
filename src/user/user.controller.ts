import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import JwtOrApiKeyAuthGuard from '../auth/guards/jwt-apiKey-auth.guard'
import { UserService } from './user.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'
import { User } from './user.decorator'

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: [UserEntity] })
  @UseGuards(JwtOrApiKeyAuthGuard)
  @Get()
  getUsers(): Promise<UserEntity[]> {
    return this.userService.getAllUsers().then((users) => {
      return users.map((user) => {
        delete user.password
        return user
      })
    })
  }

  @ApiOkResponse({ type: UserEntity })
  @UseGuards(JwtOrApiKeyAuthGuard)
  @Put()
  updateUser(
    @User() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateUser(user.id, updateUserDto).then((user) => {
      return user
    })
  }
}
