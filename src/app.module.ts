import { Logger, Module, NestModule } from '@nestjs/common'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { GraphQLError, GraphQLFormattedError } from 'graphql'
import { LoggerModule } from 'nestjs-pino'
import {
  loggingMiddleware,
  LoggingMiddlewareOptions,
  PrismaModule,
} from 'nestjs-prisma'

import { JwtOrApiKeyAuthGuard } from './auth/guards/jwt-apiKey-auth.guard'
import { RolesGuard } from './auth/guards/roles.guard'
import { ApiKeyModule } from './api-key/api-key.module'
import { AuthModule } from './auth/auth.module'
import { HealthModule } from './health/health.module'
import { UserModule } from './user/user.module'
import databaseConfig from './config/database.config'
import httpConfig from './config/http.config'
import loggingConfig from './config/logging.config'
import securityConfig from './config/security.config'

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get<string>('logging.level'),
          customProps: () => ({
            context: 'HTTP',
          }),
          transport: {
            target: 'pino-pretty',
            options: {
              singleLine: true,
            },
          },
        },
      }),
    }),
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
            logLevel: configService.get<string>(
              'logging.level',
            ) as LoggingMiddlewareOptions['logLevel'],
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
  providers: [
    Logger,
    {
      provide: 'APP_GUARD',
      useClass: JwtOrApiKeyAuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure() {}
}
