import { ForbiddenException, Logger, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Prisma, UserRole } from '@prisma/client'

import { JwtOrApiKeyAuthGuard } from '../auth/guards/jwt-apiKey-auth.guard'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiKeyService } from './api-key.service'
import { AuthMetaData } from '../auth/decorators/auth-metadata.decorator'
import { GetUser } from '../user/decorators/user.decorator'
import { User } from '../user/entities/user.entity'
import { CreateApiKeyResponseDto } from './dto/create-api-key-response.dto'
import { CreateApiKeyDto } from './dto/create-api-key.dto'
import { GetApiKeyParamsDto } from './dto/get-api-key-params.dto'
import { ApiKey } from './entities/api-key.entity'

@Resolver(() => ApiKey)
@UseGuards(JwtAuthGuard)
@AuthMetaData(`${JwtOrApiKeyAuthGuard.name}Skip`)
export class ApiKeyResolver {
  private readonly logger: Logger = new Logger(ApiKeyResolver.name)

  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Mutation(() => CreateApiKeyResponseDto, {
    name: 'createApiKey',
    description: 'Create an API Key',
  })
  async create(
    @GetUser() user,
    @Args('data') createApiKeyDto: CreateApiKeyDto,
  ): Promise<CreateApiKeyResponseDto> {
    if (createApiKeyDto.userId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You are not allowed to create an API Key for another user',
      )
    }
    return this.apiKeyService.create(createApiKeyDto)
  }

  @Query(() => [ApiKey], { name: 'apiKeys' })
  async getApiKeys(
    @GetUser() user: User,
    @Args() query: GetApiKeyParamsDto,
  ): Promise<ApiKey[]> {
    const params: Prisma.ApiKeyWhereInput =
      user.role === UserRole.ADMIN ? query : { userId: user.id }

    return this.apiKeyService.getAll(params).then((apiKeys) => {
      return apiKeys.map((apiKey) => new ApiKey(apiKey))
    })
  }

  @Mutation(() => ApiKey, { name: 'deleteApiKey' })
  async deleteApiKey(@GetUser() user, @Args('id') id: number): Promise<ApiKey> {
    return this.apiKeyService.delete(user.id, id)
  }
}
