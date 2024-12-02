import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

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
import { GetApiKeyParamsDto } from './dto/get-api-key-params.dto'
import { ApiKey } from './entities/api-key.entity'

@ApiTags('api-keys')
@Controller('api-keys')
@UseGuards(JwtAuthGuard)
@AuthMetaData(`${JwtOrApiKeyAuthGuard.name}Skip`)
@ApiUnauthorizedResponse({
  type: UnauthorizedExceptionI,
  description: 'Unauthorized',
})
@ApiForbiddenResponse({
  type: ForbiddenExceptionI,
  description: 'Forbidden',
})
export class ApiKeyController {
  private readonly logger: Logger = new Logger(ApiKeyController.name)

  constructor(private readonly apiKeyService: ApiKeyService) {}

  @ApiBody({
    type: CreateApiKeyDto,
    description: 'Request object for creating an API Key',
  })
  @ApiCreatedResponse({
    type: CreateApiKeyResponseDto,
    description: 'API Key created successfully',
  })
  @ApiBadRequestResponse({
    type: BadRequestExceptionI,
    description: 'Bad Request',
  })
  @ApiNotFoundResponse({
    type: NotFoundExceptionI,
    description: 'Not Found',
  })
  @ApiBearerAuth()
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
  @ApiBadRequestResponse({
    type: BadRequestExceptionI,
    description: 'Bad Request',
  })
  @ApiQuery({
    type: GetApiKeyParamsDto,
    description: 'Filter API Keys by user ID',
  })
  @ApiBearerAuth()
  @Get()
  getAllApiKeys(@GetUser() user: User, @Query() query: GetApiKeyParamsDto) {
    if (user.role !== UserRole.ADMIN) {
      if (query.userId && query.userId !== user.id) {
        throw new ForbiddenException(
          'You are not allowed to view API Keys for another user',
        )
      }
      query = { ...query, userId: user.id }
    }

    return this.apiKeyService.getAllApiKeys(query)
  }

  @ApiOkResponse({ type: ApiKey, description: 'API Key deleted successfully' })
  @ApiNotFoundResponse({
    type: NotFoundExceptionI,
    description: 'API Key not found',
  })
  @ApiBearerAuth()
  @Delete(':id')
  delete(@Param('id') apiKeyId: number, @GetUser('id') userId: User['id']) {
    return this.apiKeyService.deleteApiKey(apiKeyId, userId)
  }
}
