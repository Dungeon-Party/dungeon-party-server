import { ForbiddenException, Logger, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserRole } from '@prisma/client'

import { JwtOrApiKeyAuthGuard } from '../auth/guards/jwt-apiKey-auth.guard'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiKeyService } from './api-key.service'
import { AuthMetaData } from '../auth/decorators/auth-metadata.decorator'
import { GetUser } from '../user/decorators/user.decorator'
import { User } from '../user/entities/user.entity'
import { CreateApiKeyResponseDto } from './dto/create-api-key-response.dto'
import { CreateApiKeyDto } from './dto/create-api-key.dto'
import { ApiKey } from './entities/api-key.entity'

@Resolver(() => ApiKey)
export class ApiKeyResolver {
  private readonly logger: Logger = new Logger(ApiKeyResolver.name)

  constructor(private readonly apiKeyService: ApiKeyService) {}

  @UseGuards(JwtAuthGuard)
  // FIXME: The AuthMetaData decorator is not being applied to the createApiKey mutation
  // https://stackoverflow.com/questions/79212346/nestjs-graphql-access-resolver-method-metadata
  @AuthMetaData(`${JwtOrApiKeyAuthGuard.name}Skip`)
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

  @UseGuards(JwtAuthGuard)
  @Query(() => [ApiKey], { name: 'apiKeys' })
  async getApiKeys(@GetUser() user: User): Promise<ApiKey[]> {
    return this.apiKeyService.getAllApiKeys(user).then((apiKeys) => {
      return apiKeys.map((apiKey) => new ApiKey(apiKey))
    })
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => ApiKey, { name: 'apiKey', nullable: true })
  async getApiKeyById(@Args('id') id: number): Promise<ApiKey | null> {
    return this.apiKeyService.findApiKeyById(id).then((apiKey) => {
      return new ApiKey(apiKey)
    })
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ApiKey, { name: 'deleteApiKey' })
  async deleteApiKey(@GetUser() user, @Args('id') id: number): Promise<ApiKey> {
    return this.apiKeyService.deleteApiKey(user.id, id)
  }
}
