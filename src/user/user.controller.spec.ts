import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { UserController } from './user.controller'
import { UserService } from './user.service'
import { getUser } from '../utils/test-utils'
import { User as UserEntity } from './entities/user.entity'

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

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const users: UserEntity[] = [getUser(), getUser()]
      userService.getAllUsers.mockResolvedValue(users)
      const respone = await controller.getUsers()

      expect(respone).toEqual(users)
    })
  })
})
