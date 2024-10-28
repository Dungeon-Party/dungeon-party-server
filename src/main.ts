import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Request } from 'express'
import helmet from 'helmet'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

import { AppModule } from './app.module'

function bootstrapSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('Dungeon Party API')
    .setDescription('API for Dungeon Party')
    .addBearerAuth()
    .addApiKey(
      {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
      'api-key',
    )
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(':version/docs', app, documentFactory, {
    useGlobalPrefix: true,
    jsonDocumentUrl: ':version/docs/json',
    patchDocumentOnRequest: (req, _res, document) => {
      // NOTE: Make a deep copy of the original document or it will be modified on subsequent calls!
      const copyDocument = JSON.parse(JSON.stringify(document))
      const version = (req as Request).params.version
      const isValidVersion = /^v[0-9]+$/

      if (!version || !isValidVersion.test(version)) {
        return
      } else {
        copyDocument.info.version = version
      }

      for (const route in document.paths) {
        if (route.includes(`/${version}/`)) {
          continue
        }
        delete copyDocument.paths[route]
      }

      return copyDocument
    },
  })
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  // Setup Winston Logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

  // Setup helmet
  app.use(helmet())

  // Setup global prefix
  app.setGlobalPrefix('api')

  // Setup versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })

  // Setup class serializer interceptor and validation pipe
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.useGlobalPipes(new ValidationPipe())

  // Setup Swagger
  bootstrapSwagger(app)

  await app.listen(parseInt(app.get(ConfigService).get<string>('http.port')))
}
bootstrap()
