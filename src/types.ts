import { ApiProperty } from '@nestjs/swagger'

export const ROLES_KEY = 'roles'

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export class UnauthorizedException {
  @ApiProperty({
    type: 'string',
    example: 'Unauthorized',
    description: 'The error message',
  })
  message: string

  @ApiProperty({
    type: 'number',
    example: 401,
    description: 'The status code',
  })
  statusCode: number
}

export class NotFoundException {
  @ApiProperty({
    type: 'string',
    example: 'Not Found',
    description: 'The error message',
  })
  message: string

  @ApiProperty({
    type: 'number',
    example: 404,
    description: 'The status code',
  })
  statusCode: number
}

export class BadRequestException {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
    },
    example: ['You did something wrong'],
    description: 'The error message',
  })
  message: string[]

  @ApiProperty({
    type: 'string',
    example: 'Bad Request',
    description: 'The error name',
  })
  error: string

  @ApiProperty({
    type: 'number',
    example: 400,
    description: 'The status code',
  })
  statusCode: number
}
