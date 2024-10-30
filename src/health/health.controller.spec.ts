import { HealthCheckService } from '@nestjs/terminus'
import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { HealthController } from './health.controller'

describe('HealthController', () => {
  let healthCheckController: HealthController
  let healthCheckService: DeepMockProxy<HealthCheckService>

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

    healthCheckService = module.get(HealthCheckService)
    healthCheckController = module.get(HealthController)
  })

  it('should be defined', () => {
    expect(healthCheckController).toBeDefined()
  })

  describe('check', () => {
    it('should return the health check', async () => {
      healthCheckService.check.mockResolvedValueOnce({
        status: 'ok',
        details: {},
      })
      const result = await healthCheckController.check()
      expect(result).toEqual({ status: 'ok', details: {} })
    })
  })
})
