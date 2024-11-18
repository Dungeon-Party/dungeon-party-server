import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { User as PrismaUser } from '@prisma/client'
import * as argon2 from 'argon2'
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { UserService } from './user.service'
import { getUser } from '../utils/test-utils'
import { User } from './entities/user.entity'
import { UserRepository } from './user.repository'

describe('UserService', () => {
  let userService: UserService
  let userRepository: DeepMockProxy<UserRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    })
      .overrideProvider(UserRepository)
      .useValue(mockDeep<UserRepository>())
      .useMocker(mockDeep)
      .compile()

    userRepository = module.get(UserRepository)
    userService = module.get(UserService)
  })

  describe('createUser', () => {
    it('should return the value of userRepository.create', async () => {
      const user = getUser()
      userRepository.create.mockResolvedValue(user)
      const result = await userService.createUser(user)
      expect(result.name).toBe(user.name)
      expect(result.username).toBe(user.username)
      expect(result.email).toBe(user.email)
    })

    it('should return the type of User', async () => {
      const user = getUser()
      userRepository.create.mockResolvedValue(user as PrismaUser)
      const result = await userService.createUser(user)
      expect(user).not.toBeInstanceOf(User)
      expect(result).toBeInstanceOf(User)
    })

    it('should hash the password', async () => {
      const user = getUser()
      userRepository.create.mockResolvedValue(user)
      jest.spyOn(argon2, 'hash').mockResolvedValue('hashed-password')
      await userService.createUser(user)
      expect(argon2.hash).toHaveBeenCalled()
    })
  })

  describe('findUserById', () => {
    it('should return the value of userRepository.findUnique', async () => {
      const user = getUser()
      userRepository.findUnique.mockResolvedValue(user)
      const result = await userService.findUserById(user.id)
      expect(result).toEqual(user)
    })

    it('should return the type of User', async () => {
      const user = getUser()
      userRepository.findUnique.mockResolvedValue(user as PrismaUser)
      const result = await userService.findUserById(user.id)
      expect(user).not.toBeInstanceOf(User)
      expect(result).toBeInstanceOf(User)
    })

    it('should throw an error when the user does not exist', async () => {
      userRepository.findUnique.mockResolvedValue(null)
      expect(userService.findUserById(1)).rejects.toThrow(NotFoundException)
    })
  })

  describe('findUserByEmailOrUsername', () => {
    it('should return the value of userRepository.findFirst', async () => {
      const user = getUser()
      userRepository.findFirst.mockResolvedValue(user)
      const result = await userService.findUserByEmailOrUsername(
        user.email,
        user.username,
      )
      expect(result).toEqual(user)
    })

    it('should return the type of User', async () => {
      const user = getUser()
      userRepository.findFirst.mockResolvedValue(user)
      const result = await userService.findUserByEmailOrUsername(
        user.email,
        user.username,
      )
      expect(user).not.toBeInstanceOf(User)
      expect(result).toBeInstanceOf(User)
    })

    it('should throw an error when the user does not exist', async () => {
      userRepository.findFirst.mockResolvedValue(null)
      expect(
        userService.findUserByEmailOrUsername('test', 'test'),
      ).rejects.toThrow(NotFoundException)
    })

    it('should throw an error when the user does not exist', async () => {
      userRepository.findFirst.mockResolvedValue(null)
      expect(
        userService.findUserByEmailOrUsername('test', 'test'),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('getAllUsers', () => {
    it('should return the value of userRepository.findMany', async () => {
      const users = [getUser(), getUser()]
      userRepository.findMany.mockResolvedValue(users)
      const result = await userService.getAllUsers()
      expect(result).toEqual(users)
    })

    it('should return the type of User', async () => {
      const users = [getUser(), getUser()]
      userRepository.findMany.mockResolvedValue(users)
      const result = await userService.getAllUsers()
      for (const user of users) {
        expect(user).not.toBeInstanceOf(User)
      }
      for (const user of result) {
        expect(user).toBeInstanceOf(User)
      }
    })
  })

  describe('updateUser', () => {
    it('should return the value of userRepository.update', async () => {
      const user = getUser()
      userRepository.update.mockResolvedValue(user)
      const result = await userService.updateUser(user.id, user)
      expect(result.name).toBe(user.name)
    })

    it('should return the type of User', async () => {
      const user = getUser()
      userRepository.update.mockResolvedValue(user)
      const result = await userService.updateUser(user.id, user)
      expect(user).not.toBeInstanceOf(User)
      expect(result).toBeInstanceOf(User)
    })
  })

  describe('deleteUser', () => {
    it('should return the value of userRepository.delete', async () => {
      const user = getUser()
      userRepository.delete.mockResolvedValue(user)
      const result = await userService.deleteUser(user.id)
      expect(result.name).toBe(user.name)
    })

    it('should return the type of User', async () => {
      const user = getUser()
      userRepository.delete.mockResolvedValue(user)
      const result = await userService.deleteUser(user.id)
      expect(user).not.toBeInstanceOf(User)
      expect(result).toBeInstanceOf(User)
    })
  })
})
