import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyService } from './api-key.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ApiKeyEntity } from './entities/api-key.entity';
// import * as argon2 from 'argon2';
// import crypto from 'crypto';

// jest.mock('argon2');
// jest.mock('crypto');

const argon2Mocked = jest.createMockFromModule<jest.Mocked<typeof import('argon2')>>('argon2');
const cryptoMocked = jest.createMockFromModule<typeof import('crypto')>('crypto');
// jest.mock('argon2', () => ({
//   __esModule: true,
//   hash: jest.fn(),
// }))
// jest.mock('crypto', () => ({
//   __esModule: true,
//   ...jest.requireActual('crypto'),
//   randomBytes: jest.fn()
// }))
// console.log(globalThis)
// console.log(window)
// jest.spyOn(crypto, 'randomBytes').mockImplementation(() => Buffer.from('kljsdf892hhlk3hkl'));

// Object.defineProperty(globalThis, 'crypto', {
//   value: {
//     randomBytes: {
//       toString: jest.fn(),
//     },
//     createHash: jest.fn(),
//   }
// })

describe('ApiKeyService', () => {
  let apiKeyService: ApiKeyService;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyService,
      ]
    })
    .useMocker(mockDeep)
    .compile();

    prismaService = module.get(PrismaService);
    apiKeyService = module.get(ApiKeyService);
  });

  describe('create', () => {
    it('should return the result of prismaService.apiKey.create method', async () => {
      const apiKeyPart = 'kljsdf892hhlk3hkl';
      const result: ApiKeyEntity = {
        id: 1,
        name: 'test',
        key: 'should-not-returned',
        expiresAt: new Date(),
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaService.apiKey.create.mockResolvedValueOnce(result);
      cryptoMocked.randomBytes = jest.fn().mockReturnValueOnce(Buffer.from(apiKeyPart));
      (argon2Mocked.hash as jest.Mock).mockResolvedValueOnce(apiKeyPart);
      cryptoMocked.createHash = jest.fn(() => ({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn(() => 'mocked_hash')
      }) as unknown as import('crypto').Hash);
      const createApiKeyDto = { name: 'test', userId: 1 };

      const apiKey = await apiKeyService.create(createApiKeyDto);
      expect(apiKey).toEqual({ ...result, key: `dp-${apiKeyPart}.${apiKeyPart}` });
    })
  })

  // describe('remove', () => {})

  // describe('findValidApiKey', () => {})
});
