import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiKeyService } from './api-key.service'
import { UserEntity } from '../user/entities/user.entity'
import { User } from '../user/user.decorator'
import { CreateApiKeyDto } from './dto/create-api-key.dto'

@ApiTags('api-keys')
@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @ApiBody({ type: CreateApiKeyDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createApiKeyDto: CreateApiKeyDto,
    @User('id') userId: UserEntity['id'],
  ) {
    return this.apiKeyService.createApiKey(createApiKeyDto, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') apiKeyId: number, @User('id') userId: UserEntity['id']) {
    return this.apiKeyService.deleteApiKey(apiKeyId, userId)
  }
}
