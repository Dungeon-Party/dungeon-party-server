// TODO: Ensure that all necessary methods have guards
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard'
import { ApiKeyService } from './api-key.service'
import { GqlUser } from '../user/decorators/gql-user.decorator'
import { User as UserEntity } from '../user/entities/user.entity'
import { CreateApiKeyResponseDto } from './dto/create-api-key-response.dto'
import { CreateApiKeyDto } from './dto/create-apiKey.dto'
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

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => ApiKeyEntity, { name: 'apiKey', nullable: true })
  async getApiKeyById(@Args('id') id: number): Promise<ApiKeyEntity | null> {
    return this.apiKeyService.findApiKeyById(id).then((apiKey) => {
      return new ApiKeyEntity(apiKey)
    })
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => CreateApiKeyResponseDto, { name: 'createApiKey' })
  async createApiKey(
    @GqlUser() user,
    @Args('data') input: CreateApiKeyDto,
  ): Promise<CreateApiKeyResponseDto> {
    return this.apiKeyService.createApiKey(user.id, input)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => ApiKeyEntity, { name: 'deleteApiKey' })
  async deleteApiKey(
    @GqlUser() user,
    @Args('id') id: number,
  ): Promise<ApiKeyEntity> {
    return this.apiKeyService.deleteApiKey(user.id, id)
  }
}
