import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserEntity } from './entities/user.entity'

describe('UserController', () => {
  let controller: UserController
  let userService: DeepMockProxy<UserService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockDeep<UserService>(),
        },
      ],
    })
      .useMocker(mockDeep)
      .compile()

    controller = module.get(UserController)
    userService = module.get(UserService)
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: UserEntity[] = [
        { id: 1, name: 'John Doe' } as UserEntity,
        { id: 2, name: 'Jane Smith' } as UserEntity,
      ]
      userService.findAll.mockResolvedValue(users)
      const respone = await controller.findAll()

      expect(respone).toEqual(users)
    })
  })
})
