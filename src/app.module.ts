import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { utilities, WinstonModule } from 'nest-winston'
import {
  loggingMiddleware,
  LoggingMiddlewareOptions,
  PrismaModule,
  providePrismaClientExceptionFilter,
} from 'nestjs-prisma'
import { format, transports } from 'winston'

import { ApiKeyModule } from './api-key/api-key.module'
import { AuthModule } from './auth/auth.module'
import { HealthModule } from './health/health.module'
import { UserModule } from './users/user.module'
import databaseConfig from './config/database.config'
import httpConfig from './config/http.config'
import loggingConfig from './config/logging.config'
import securityConfig from './config/security.config'
import { RequestLoggingMiddleware } from './middleware/request-logging.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [httpConfig, databaseConfig, securityConfig, loggingConfig],
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        level: configService.get<string>('logging.level'),
        format: format.combine(
          format.timestamp(),
          format.ms(),
          utilities.format.nestLike('Dungeon Party', {
            colors: true,
            prettyPrint: true,
            processId: false,
            appName: true,
          }),
        ),
        transports: [new transports.Console()],
      }),
      inject: [ConfigService],
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel:
              configService.get<string>('logging.level') === 'info'
                ? 'log'
                : (configService.get<string>(
                    'logging.level',
                  ) as LoggingMiddlewareOptions['logLevel']),
          }),
        ],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ApiKeyModule,
    UserModule,
    HealthModule,
  ],
  providers: [providePrismaClientExceptionFilter()],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*')
  }
}
