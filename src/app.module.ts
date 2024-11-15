import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { GraphQLError, GraphQLFormattedError } from 'graphql'
import {
  loggingMiddleware,
  LoggingMiddlewareOptions,
  PrismaModule,
} from 'nestjs-prisma'

import { ApiKeyModule } from './api-key/api-key.module'
import { AuthModule } from './auth/auth.module'
import { HealthModule } from './health/health.module'
import { UserModule } from './user/user.module'
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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res }) => ({ req, res }),
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message:
            (error.extensions?.originalError as Error)?.message ||
            error.message,
        }
        return graphQLFormattedError
      },
    }),
    AuthModule,
    ApiKeyModule,
    UserModule,
    HealthModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*')
  }
}
