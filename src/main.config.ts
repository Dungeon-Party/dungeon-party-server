import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common'
import { HttpAdapterHost, Reflector } from '@nestjs/core'
import helmet from 'helmet'
import { PrismaClientExceptionFilter } from 'nestjs-prisma'

export default function bootstrap(app) {
  // Setup helmet
  app.use(helmet())

  // Setup global prefix
  app.setGlobalPrefix('api')

  // Setup versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })

  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

  // Setup class serializer interceptor and validation pipe
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
}
