import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { Prisma } from '@prisma/client'

import { JwtOrApiKeyAuthGuard } from '../auth/guards/jwt-apiKey-auth.guard'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiKeyService } from './api-key.service'
import { AuthMetaData } from '../auth/decorators/auth-metadata.decorator'
import {
  BadRequestExceptionI,
  ForbiddenExceptionI,
  NotFoundExceptionI,
  UnauthorizedExceptionI,
  UserRole,
} from '../types'
import { GetUser } from '../user/decorators/user.decorator'
import { User } from '../user/entities/user.entity'
import { CreateApiKeyResponseDto } from './dto/create-api-key-response.dto'
import { CreateApiKeyDto } from './dto/create-api-key.dto'
import { ApiKey } from './entities/api-key.entity'

@ApiTags('api-keys')
@Controller('api-keys')
@AuthMetaData(`${JwtOrApiKeyAuthGuard.name}Skip`)
@ApiUnauthorizedResponse({
  type: UnauthorizedExceptionI,
  description: 'Unauthorized',
})
export class ApiKeyController {
  private readonly logger: Logger = new Logger(ApiKeyController.name)

  constructor(private readonly apiKeyService: ApiKeyService) {}

  @ApiBody({
    type: CreateApiKeyDto,
    description: 'Request object for creating an API Key',
  })
  @ApiOkResponse({
    type: CreateApiKeyResponseDto,
    description: 'API Key created successfully',
  })
  @ApiForbiddenResponse({
    type: ForbiddenExceptionI,
    description: 'Forbidden',
  })
  @ApiBadRequestResponse({
    type: BadRequestExceptionI,
    description: 'Bad Request',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @GetUser() user: User,
    @Body() createApiKeyDto: CreateApiKeyDto,
  ): Promise<CreateApiKeyResponseDto> {
    if (createApiKeyDto.userId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You are not allowed to create an API Key for another user',
      )
    }
    return this.apiKeyService.create(createApiKeyDto)
  }

  @ApiOkResponse({
    type: ApiKey,
    description: 'List of API Keys',
    isArray: true,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllApiKeys(@GetUser() user: User) {
    const params: Prisma.ApiKeyFindManyArgs =
      user.role === UserRole.ADMIN ? {} : { where: { userId: user.id } }

    return this.apiKeyService.getAllApiKeys(params)
  }

  @ApiOkResponse({ type: ApiKey, description: 'API Key deleted successfully' })
  @ApiNotFoundResponse({
    type: NotFoundExceptionI,
    description: 'API Key not found',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') apiKeyId: number, @GetUser('id') userId: User['id']) {
    return this.apiKeyService.deleteApiKey(apiKeyId, userId)
  }
}
