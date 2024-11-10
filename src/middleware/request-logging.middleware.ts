import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP')

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request
    const userAgent = request.get('user-agent') || ''

    response.on('close', () => {
      const { statusCode } = response
      const contentLength = response.get('content-length')
      const message = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`

      // FIXME: Correct this logic for proper logging levels
      if (statusCode < 500 && statusCode > 200) {
        this.logger.warn(message)
      } else if (statusCode >= 500) {
        this.logger.error(message)
      } else {
        this.logger.log(message)
      }
    })

    if (next) next()
  }
}
