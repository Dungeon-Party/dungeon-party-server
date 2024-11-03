import { Injectable } from '@nestjs/common'
import { ApiKey, Prisma } from '@prisma/client'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class ApiKeyRepository {
  constructor(private readonly db: PrismaService) {}

  async createApiKey(params: {
    data: Prisma.ApiKeyCreateInput
  }): Promise<ApiKey> {
    const { data } = params
    return this.db.apiKey.create({ data })
  }

  async getApiKey(params: {
    where: Prisma.ApiKeyWhereUniqueInput
  }): Promise<ApiKey> {
    const { where } = params
    return this.db.apiKey.findUnique({ where })
  }

  async getApiKeys(params: {
    skip?: number
    take?: number
    cursor?: Prisma.ApiKeyWhereUniqueInput
    where?: Prisma.ApiKeyWhereInput
    orderBy?: Prisma.ApiKeyOrderByWithRelationInput
  }): Promise<ApiKey[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.db.apiKey.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async findApiKey(params: {
    where: Prisma.ApiKeyWhereInput
  }): Promise<ApiKey> {
    const { where } = params
    return this.db.apiKey.findFirst({ where })
  }

  async updateApiKey(params: {
    where: Prisma.ApiKeyWhereUniqueInput
    data: Prisma.ApiKeyUpdateInput
  }): Promise<ApiKey> {
    const { where, data } = params
    return this.db.apiKey.update({ data, where })
  }

  async deleteApiKey(params: {
    where: Prisma.ApiKeyWhereUniqueInput
  }): Promise<ApiKey> {
    const { where } = params
    return this.db.apiKey.delete({ where })
  }
}
