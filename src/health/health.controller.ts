// TODO: Ensure that swagger description, response, and body is added to each method
// TODO: Inject logger and log any exceptions
import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus'
import { PrismaService } from 'nestjs-prisma'

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      /* istanbul ignore next */
      async () => this.prismaHealth.pingCheck('prisma', this.prisma),
    ])
  }
}
