import { HealthCheckService } from '@nestjs/terminus'
import { Test, TestingModule } from '@nestjs/testing'
import { mockDeep } from 'jest-mock-extended'

import { HealthController } from './health.controller'

describe('HealthController', () => {
  let healthCheckController: HealthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockDeep<HealthCheckService>(),
        },
      ],
    })
      .useMocker(mockDeep)
      .compile()

    healthCheckController = module.get(HealthController)
  })

  it('should be defined', () => {
    expect(healthCheckController).toBeDefined()
  })
})
