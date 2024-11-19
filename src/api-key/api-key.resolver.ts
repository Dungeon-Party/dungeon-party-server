import { Logger, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiKeyService } from './api-key.service'
import { GqlUser } from '../user/decorators/gql-user.decorator'
import { User } from '../user/entities/user.entity'
import { CreateApiKeyResponseDto } from './dto/create-api-key-response.dto'
import { CreateApiKeyDto } from './dto/create-api-key.dto'
import { ApiKey } from './entities/api-key.entity'

@Resolver(() => ApiKey)
export class ApiKeyResolver {
  private readonly logger: Logger = new Logger(ApiKeyResolver.name)

  constructor(private readonly apiKeyService: ApiKeyService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [ApiKey], { name: 'apiKeys' })
  async getApiKeys(@GqlUser() user: User): Promise<ApiKey[]> {
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
  @Mutation(() => CreateApiKeyResponseDto, { name: 'createApiKey' })
  async createApiKey(
    @GqlUser() user,
    @Args('data') input: CreateApiKeyDto,
  ): Promise<CreateApiKeyResponseDto> {
    return this.apiKeyService.createApiKey(user.id, input)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ApiKey, { name: 'deleteApiKey' })
  async deleteApiKey(@GqlUser() user, @Args('id') id: number): Promise<ApiKey> {
    return this.apiKeyService.deleteApiKey(user.id, id)
  }
}
