import { Controller, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('api-key')
@Controller('api-key')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createApiKeyDto: CreateApiKeyDto) {
    return this.apiKeyService.create(createApiKeyDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiKeyService.remove({
      id: Number(id),
    });
  }
}
