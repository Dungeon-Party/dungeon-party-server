import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { MockFactory } from 'mockingbird'

import { JwtOrApiKeyAuthGuard } from '../auth/guards/jwt-apiKey-auth.guard'
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

  describe('profile', () => {
    it('should return the user profile when the user id passed is the same as the users', async () => {
      const requestingUser = MockFactory<User>(User).plain().one()
      const requestedUser = MockFactory<User>(User)
        .mutate({ id: requestingUser.id })
        .plain()
        .one()
      userService.findUserById.mockResolvedValue(requestedUser)
      expect(
        await controller.getProfile(requestedUser.id, requestingUser),
      ).toEqual(requestedUser)
    })

    it('should be protected by the jwt or api-key strategy', () => {
      expect(
        Reflect.getMetadata('__guards__', controller.getProfile).some(
          (guard) => guard.name === JwtOrApiKeyAuthGuard.name,
        ),
      ).toBeTruthy()
    })
  })
})
