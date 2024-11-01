import { Controller, Get } from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus'
import { PrismaService } from 'nestjs-prisma'

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
