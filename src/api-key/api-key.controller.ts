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
import { User } from '../decorators/user.decorator'
import { UserEntity } from '../user/entities/user.entity'
import { CreateApiKeyDto } from './dto/create-api-key.dto'

@ApiTags('api-key')
@Controller('api-key')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @ApiBody({ type: CreateApiKeyDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createApiKeyDto: CreateApiKeyDto,
    @User('id') userId: UserEntity['id'],
  ) {
    return this.apiKeyService.create(createApiKeyDto, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') apiKeyId: string, @User('id') userId: UserEntity['id']) {
    return this.apiKeyService.delete({
      id: Number(apiKeyId),
      userId: userId,
    })
  }
}
