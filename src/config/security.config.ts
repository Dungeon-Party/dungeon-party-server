import { randomBytes } from 'crypto'
import { registerAs } from '@nestjs/config'

export default registerAs('security', () => ({
  jwt: {
    secret: process.env.SECURITY_JWT_SECRET || randomBytes(32).toString('hex'),
    accessExpiresIn: process.env.SECURITY_JWT_ACCESS_EXPIRES || '10m',
    refreshExpiresIn: process.env.SECURITY_JWT_REFRESH_EXPIRES || '7d',
  },
  apiKey: {
    prefix: process.env.SECURITY_API_KEY_PREFIX || 'dp',
    expirationLength: process.env.SECURITY_API_KEY_EXPIRATION_LENGTH || 7,
  },
}))
