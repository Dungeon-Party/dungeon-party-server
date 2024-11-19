// TODO: Ensure that swagger description, response, and body is added to each method
// TODO: Inject logger and log any exceptions
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { JwtOrApiKeyAuthGuard } from '../auth/guards/jwt-apiKey-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { UserService } from './user.service'
import { Roles } from '../auth/decorators/roles.decorator'
import { ForbiddenExceptionI, UnauthorizedExceptionI, UserRole } from '../types'
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

  @ApiOkResponse({ type: User, description: 'Profile retrieved successfully' })
  @ApiUnauthorizedResponse({
    type: UnauthorizedExceptionI,
    description: 'Invalid credentials',
  })
  @ApiForbiddenResponse({
    type: ForbiddenExceptionI,
    description: 'Forbidden',
  })
  @ApiBearerAuth()
  @ApiSecurity('api-key')
  @UseGuards(JwtOrApiKeyAuthGuard)
  @Get('profile/:id')
  getProfile(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<User> {
    if (id !== user.id && user.role !== UserRole.ADMIN.toString()) {
      throw new ForbiddenException()
    }

    return this.userService.findUserById(id)
  }
}
