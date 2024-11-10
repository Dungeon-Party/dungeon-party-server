// TODO: Ensure that swagger description, response, and body is added to each method
// TODO: Inject logger and log any exceptions
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import JwtOrApiKeyAuthGuard from '../auth/guards/jwt-apiKey-auth.guard'
import { UserService } from './user.service'
import { User } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { User as UserEntity } from './entities/user.entity'

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: [UserEntity] })
  @UseGuards(JwtOrApiKeyAuthGuard)
  @Get()
  getUsers(): Promise<UserEntity[]> {
    return this.userService.getAllUsers()
  }

  @ApiOkResponse({ type: UserEntity })
  @UseGuards(JwtOrApiKeyAuthGuard)
  @Put()
  updateUser(
    @User() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateUser(user.id, updateUserDto)
  }
}
