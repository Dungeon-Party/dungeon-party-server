import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { UserService } from './user.service'
import { getUser } from '../utils/test-utils'
import { User } from './entities/user.entity'
import { UserResolver } from './user.resolver'

describe('UserResolver', () => {
  let userResolver: UserResolver
  let userService: DeepMockProxy<UserService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            getAllUsers: jest.fn(),
            findUserById: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(UserService)
      .useValue(mockDeep<UserService>())
      .useMocker(mockDeep)
      .compile()

    userResolver = module.get(UserResolver)
    userService = module.get(UserService)
  })

  it('should be defined', () => {
    expect(userResolver).toBeDefined()
  })

  describe('getUsers', () => {
    it('should return the value of userService.getAllUsers', async () => {
      const users = [getUser(), getUser()] as User[]
      userService.getAllUsers.mockResolvedValue(users)
      const result = await userResolver.getUsers()
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe(users[0].name)
      expect(result[1].name).toBe(users[1].name)
    })
  })

  describe('getUserById', () => {
    it('should return the value of userService.findUserById', async () => {
      const user = { id: 1, name: 'test' } as User
      userService.findUserById.mockResolvedValue(user)
      const result = await userResolver.getUserById(1)
      expect(result.name).toBe(user.name)
    })
  })

  describe('createUser', () => {
    it('should return the value of userService.createUser', async () => {
      const user = getUser() as User
      userService.createUser.mockResolvedValue(user)
      const result = await userResolver.createUser(user)
      expect(result.name).toBe(user.name)
      expect(result.username).toBe(user.username)
      expect(result.email).toBe(user.email)
    })
  })

  describe('updateUser', () => {
    it('should return the value of userService.updateUser', async () => {
      const user = getUser() as User
      userService.updateUser.mockResolvedValue(user)
      const result = await userResolver.updateUser(1, user)
      expect(result.name).toBe(user.name)
      expect(result.username).toBe(user.username)
      expect(result.email).toBe(user.email)
    })
  })

  describe('deleteUser', () => {
    it('should return the value of userService.deleteUser', async () => {
      const user = getUser() as User
      userService.deleteUser.mockResolvedValue(user)
      const result = await userResolver.deleteUser(1)
      expect(result.name).toBe(user.name)
      expect(result.username).toBe(user.username)
      expect(result.email).toBe(user.email)
    })
  })
})
