import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
  @ApiUnauthorizedResponse({
    type: UnauthorizedExceptionI,
    description: 'Unauthorized',
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
  create(
    @Body() createApiKeyDto: CreateApiKeyDto,
    @GetUser() user: User,
  ): Promise<CreateApiKeyResponseDto> {
    if (createApiKeyDto.userId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You are not allowed to create an API Key for another user',
      )
    }
    return this.apiKeyService.createApiKey(createApiKeyDto)
  }

  @ApiOkResponse({ type: ApiKey, description: 'API Key deleted successfully' })
  @ApiUnauthorizedResponse({
    type: UnauthorizedExceptionI,
    description: 'Unauthorized',
  })
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
