import { ArgsType, Field, Int } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import moment from 'moment'

@ArgsType()
export class GetApiKeyParamsDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  userId?: number

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  expiresAt?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  createdAt?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  updatedAt?: string

  static buildParams(
    params: Prisma.ApiKeyWhereInput,
  ): Prisma.ApiKeyFindManyArgs {
    const where: Prisma.ApiKeyWhereInput = {}

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        if (
          ['expiresAt', 'createdAt', 'updatedAt'].includes(key) &&
          typeof value === 'string'
        ) {
          const [, operation, date] = value.match(/([><=]+)([\d-TZ:.]+)/)
          switch (operation) {
            case '>':
              where[key] = { gt: moment(date).toDate() }
              break
            case '<':
              where[key] = { lt: moment(date).toDate() }
              break
            case '>=':
              where[key] = { gte: moment(date).toDate() }
              break
            case '<=':
              where[key] = { lte: moment(date).toDate() }
              break
            case 'default':
            case '=':
              where[key] = { equals: moment(date).toDate() }
              break
          }
        } else if (key === 'name' && typeof value === 'string') {
          where[key] = { contains: value, mode: 'insensitive' }
        } else {
          where[key] = value
        }
      }
    }

    return { where }
  }
}
