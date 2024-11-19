// TODO: Ensure that swagger description, response, and body is added to each method
// TODO: Inject logger and log any exceptions
import { Body, Controller, Get, Logger, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import JwtOrApiKeyAuthGuard from '../auth/guards/jwt-apiKey-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { UserService } from './user.service'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRole } from '../types'
import { GetUser } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@ApiTags('users')
@Controller('users')
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name)

  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ type: [User] })
  @UseGuards(JwtOrApiKeyAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
    // FIXME: The user id should be a param and not from the token
    return this.userService.updateUser(user.id, updateUserDto)
  }
}
