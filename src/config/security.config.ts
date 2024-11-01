import { randomBytes } from 'crypto'
import { registerAs } from '@nestjs/config'

export default registerAs('security', () => ({
  jwt: {
    secret: process.env.SECURITY_JWT_SECRET || randomBytes(32).toString('hex'),
    accessExpiresIn: process.env.SECURITY_JWT_ACCESS_EXPIRES || '10m',
    refreshExpiresIn: process.env.SECURITY_JWT_REFRESH_EXPIRES || '7d',
  },
}))
