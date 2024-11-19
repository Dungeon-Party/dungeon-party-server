import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { MockFactory } from 'mockingbird'

import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

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
      const users: User[] = [
        MockFactory<User>(User).one(),
        MockFactory<User>(User).one(),
      ]
      userService.getAllUsers.mockResolvedValue(users)
      const respone = await controller.getUsers()

      expect(respone).toEqual(users)
    })
  })

  describe('updateUser', () => {
    it('should return the result of userService.updateUser', async () => {
      const user = MockFactory<User>(User).one()
      const payload = { name: 'test' } as UpdateUserDto
      userService.updateUser.mockResolvedValue({ ...user, ...payload })
      const result = await controller.updateUser(user, payload)

      expect(result.name).toBe(payload.name)
    })
  })
})
