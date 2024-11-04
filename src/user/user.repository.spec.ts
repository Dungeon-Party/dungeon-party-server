import { Test, TestingModule } from '@nestjs/testing'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { PrismaService } from 'nestjs-prisma'

import { getUser } from '../utils/test-utils'
import { UserRepository } from './user.repository'

describe('UserRepository', () => {
  let userRepository: UserRepository
  let prismaService: DeepMockProxy<PrismaService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .useMocker(mockDeep)
      .compile()

    prismaService = module.get(PrismaService)
    userRepository = module.get(UserRepository)
  })

  describe('createUser', () => {
    it('should return the value of prismaService.user.create', async () => {
      const user = getUser()
      const params = { data: user }
      prismaService.user.create.mockResolvedValue(user)

      const result = await userRepository.create(params)

      expect(result).toEqual(user)
      expect(prismaService.user.create).toHaveBeenCalledWith(params)
    })
  })

  describe('getUser', () => {
    it('should return the value of prismaService.user.findUnique', async () => {
      const user = getUser()
      const params = { where: { id: user.id } }
      prismaService.user.findUnique.mockResolvedValue(user)

      const result = await userRepository.findUnique(params)

      expect(result).toEqual(user)
      expect(prismaService.user.findUnique).toHaveBeenCalledWith(params)
    })
  })

  describe('getUsers', () => {
    it('should return the value of prismaService.user.findMany', async () => {
      const users = [getUser(), getUser()]
      const params = { skip: 0, take: 10 }
      prismaService.user.findMany.mockResolvedValue(users)

      const result = await userRepository.findMany(params)

      expect(result).toEqual(users)
      expect(prismaService.user.findMany).toHaveBeenCalledWith(params)
    })
  })

  describe('findUser', () => {
    it('should return the value of prismaService.user.findFirst', async () => {
      const user = getUser()
      const params = { where: { email: user.email, username: user.username } }
      prismaService.user.findFirst.mockResolvedValue(user)

      const result = await userRepository.findFirst(params)

      expect(result).toEqual(user)
      expect(prismaService.user.findFirst).toHaveBeenCalledWith(params)
    })
  })

  describe('updateUser', () => {
    it('should return the value of prismaService.user.update', async () => {
      const user = getUser()
      const params = { where: { id: user.id }, data: user }
      prismaService.user.update.mockResolvedValue(user)

      const result = await userRepository.update(params)

      expect(result).toEqual(user)
      expect(prismaService.user.update).toHaveBeenCalledWith(params)
    })
  })

  describe('deleteUser', () => {
    it('should return the value of prismaService.user.delete', async () => {
      const user = getUser()
      const params = { where: { id: user.id } }
      prismaService.user.delete.mockResolvedValue(user)

      const result = await userRepository.delete(params)

      expect(result).toEqual(user)
      expect(prismaService.user.delete).toHaveBeenCalledWith(params)
    })
  })
})
