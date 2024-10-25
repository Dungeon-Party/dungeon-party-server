import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Request } from 'express'
import helmet from 'helmet'

import { AppModule } from './app.module'
import { Logger } from './common/winston/winston.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })
  app.useLogger(app.get(Logger))
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })
  app.use(helmet())

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

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
