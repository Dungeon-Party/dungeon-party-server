import {
  Body,
  Controller,
  Delete,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiKeyService } from './api-key.service'
import {
  BadRequestExceptionI,
  NotFoundExceptionI,
  UnauthorizedExceptionI,
} from '../types'
import { GetUser } from '../user/decorators/user.decorator'
import { User } from '../user/entities/user.entity'
import { CreateApiKeyResponseDto } from './dto/create-api-key-response.dto'
import { CreateApiKeyDto } from './dto/create-api-key.dto'
import { ApiKey } from './entities/api-key.entity'

@ApiTags('api-keys')
@Controller('api-keys')
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
  @ApiBadRequestResponse({
    type: BadRequestExceptionI,
    description: 'Bad Request',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createApiKeyDto: CreateApiKeyDto,
    @GetUser('id') userId: User['id'],
  ): Promise<CreateApiKeyResponseDto> {
    return this.apiKeyService.createApiKey(userId, createApiKeyDto)
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
