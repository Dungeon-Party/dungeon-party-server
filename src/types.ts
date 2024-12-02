import { ApiProperty } from '@nestjs/swagger'

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class ForbiddenExceptionI {
  @ApiProperty({
    type: 'string',
    example: 'Forbidden',
    description: 'The error message',
  })
  message: string

  @ApiProperty({
    type: 'number',
    example: 403,
    description: 'The status code',
  })
  statusCode: number
}

export class UnauthorizedExceptionI {
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

export class NotFoundExceptionI {
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

export class BadRequestExceptionI {
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
