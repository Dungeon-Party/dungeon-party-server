import { ApiKeyEntity } from '../entities/api-key.entity'

export class CreateApiKeyDto implements Partial<ApiKeyEntity> {
    name: string

    userId: number
}
