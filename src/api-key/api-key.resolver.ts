import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard'
import { ApiKeyService } from './api-key.service'
import { GqlUser } from '../user/decorators/gql-user.decorator'
import { User as UserEntity } from '../user/entities/user.entity'
import { CreateApiKeyDto } from './dto/create-api-key.dto'
import { ApiKeyEntity } from './entities/api-key.entity'

@Resolver(() => ApiKeyEntity)
export class ApiKeyResolver {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [ApiKeyEntity], { name: 'apiKeys' })
  async getApiKeys(@GqlUser() user: UserEntity): Promise<ApiKeyEntity[]> {
    return this.apiKeyService.getAllApiKeys(user).then((apiKeys) => {
      return apiKeys.map((apiKey) => new ApiKeyEntity(apiKey))
    })
  }

  @Query(() => ApiKeyEntity, { name: 'apiKey', nullable: true })
  async getApiKeyById(@Args('id') id: number): Promise<ApiKeyEntity | null> {
    return this.apiKeyService.findApiKeyById(id).then((apiKey) => {
      return new ApiKeyEntity(apiKey)
    })
  }

  @Mutation(() => ApiKeyEntity, { name: 'createApiKey' })
  async createApiKey(
    @GqlUser() user,
    @Args('data') input: CreateApiKeyDto,
  ): Promise<ApiKeyEntity> {
    return this.apiKeyService.createApiKey(user.id, input)
  }

  @Mutation(() => ApiKeyEntity, { name: 'deleteApiKey' })
  async deleteApiKey(
    @GqlUser() user,
    @Args('id') id: number,
  ): Promise<ApiKeyEntity> {
    return this.apiKeyService.deleteApiKey(user.id, id)
  }
}
