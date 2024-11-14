// TODO: Ensure that swagger description, response, and body is added to each method
// TODO: Inject logger and log any exceptions
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiKeyService } from './api-key.service'
import { GetUser } from '../user/decorators/user.decorator'
import { User } from '../user/entities/user.entity'
import { CreateApiKeyResponseDto } from './dto/create-api-key-response.dto'
import { CreateApiKeyDto } from './dto/create-apiKey.dto'

@ApiTags('api-keys')
@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @ApiBearerAuth()
  @ApiBody({ type: CreateApiKeyDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createApiKeyDto: CreateApiKeyDto,
    @GetUser('id') userId: User['id'],
  ): Promise<CreateApiKeyResponseDto> {
    return this.apiKeyService.createApiKey(userId, createApiKeyDto)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') apiKeyId: number, @GetUser('id') userId: User['id']) {
    return this.apiKeyService.deleteApiKey(apiKeyId, userId)
  }
}
