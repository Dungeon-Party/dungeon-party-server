import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { PrismaService } from 'nestjs-prisma'

import { UserService } from './user.service'
import { UserEntity } from './entities/user.entity'

describe('UserService', () => {
  let userService: UserService
  let prismaService: DeepMockProxy<PrismaService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .useMocker(mockDeep)
      .compile()

    prismaService = module.get(PrismaService)
    userService = module.get(UserService)
  })

  describe('create', () => {
    it('should return the value of prismaService.user.create', async () => {
      const data = {
        name: 'test',
        username: 'test',
        email: 'test@email.com',
        password: 'test-password',
      }
      const user = { id: 1, ...data } as UserEntity
      prismaService.user.create.mockResolvedValue(user)
      const result = await userService.create(data)
      expect(result.name).toBe(user.name)
      expect(result.username).toBe(user.username)
      expect(result.email).toBe(user.email)
    })
  })

  describe('update', () => {
    it('should return the value of prismaService.user.update', async () => {
      const params = {
        where: { id: 1 },
        data: { name: 'test' },
      }
      const user = { id: 1, name: 'test' } as UserEntity
      prismaService.user.update.mockResolvedValue(user)
      const result = await userService.update(params)
      expect(result.name).toBe(user.name)
    })
  })

  describe('delete', () => {
    it('should return the value of prismaService.user.delete', async () => {
      const where = { id: 1 }
      const user = { id: 1, name: 'test' } as UserEntity
      prismaService.user.delete.mockResolvedValue(user)
      const result = await userService.delete(where)
      expect(result.name).toBe(user.name)
    })
  })

  describe('findAll', () => {
    it('should return the value of prismaService.user.findMany', async () => {
      const users = [
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' },
      ] as UserEntity[]
      prismaService.user.findMany.mockResolvedValue(users)
      const result = await userService.findAll({})
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe(users[0].name)
      expect(result[1].name).toBe(users[1].name)
    })
  })

  describe('findOne', () => {
    it('should return the value of prismaService.user.findFirst', async () => {
      const user = { id: 1, name: 'test' } as UserEntity
      prismaService.user.findFirst.mockResolvedValue(user)
      const result = await userService.findOne({ id: 1 })
      expect(result.name).toBe(user.name)
    })
  })
})
