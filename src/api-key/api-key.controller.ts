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
import { CreateApiKeyDto } from './dto/create-api-key.dto'

@ApiTags('api-key')
@Controller('api-key')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @ApiBody({ type: CreateApiKeyDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createApiKeyDto: CreateApiKeyDto) {
    return this.apiKeyService.create(createApiKeyDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiKeyService.remove({
      id: Number(id),
    })
  }
}
