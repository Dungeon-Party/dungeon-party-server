// TODO: Ensure that swagger description, response, and body is added to each method
// TODO: Inject logger and log any exceptions
import { Body, Controller, Get, Logger, Put, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import JwtOrApiKeyAuthGuard from '../auth/guards/jwt-apiKey-auth.guard'
import { UserService } from './user.service'
import { GetUser } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@ApiTags('users')
@Controller('users')
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name)

  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: [User] })
  @UseGuards(JwtOrApiKeyAuthGuard)
  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getAllUsers()
  }

  @ApiOkResponse({ type: User })
  @UseGuards(JwtOrApiKeyAuthGuard)
  @Put()
  updateUser(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(user.id, updateUserDto)
  }
}
