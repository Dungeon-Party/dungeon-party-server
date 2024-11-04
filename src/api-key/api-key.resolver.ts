import { Args, Query, Resolver } from '@nestjs/graphql'

import { ApiKeyService } from './api-key.service'
import { ApiKeyEntity } from './entities/api-key.entity'

@Resolver(() => ApiKeyEntity)
export class ApiKeyResolver {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  // @Query(() => [ApiKeyEntity], { name: 'apiKeys' })
  // async getApiKeys(): Promise<ApiKeyEntity[]> {
  //   return this.apiKeyService.getAllApiKeys().then((apiKeys) => {
  //     return apiKeys.map((apiKey) => new ApiKeyEntity(apiKey))
  //   })
  // }

  @Query(() => ApiKeyEntity, { name: 'apiKey', nullable: true })
  async getApiKeyById(@Args('id') id: number): Promise<ApiKeyEntity | null> {
    return this.apiKeyService.findApiKeyById(id).then((apiKey) => {
      return new ApiKeyEntity(apiKey)
    })
  }

  // @Mutation(() => ApiKeyEntity, { name: 'createApiKey' })
  // async createApiKey(@Args('data') input: CreateApiKeyDto): Promise<ApiKeyEntity> {
  //   return this.apiKeyService.createApiKey(input)
  // }

  // @Mutation(() => ApiKeyEntity, { name: 'deleteApiKey' })
  // async deleteApiKey(@Args('id') id: number): Promise<ApiKeyEntity> {
  //   return this.apiKeyService.deleteApiKey(id)
  // }
}
