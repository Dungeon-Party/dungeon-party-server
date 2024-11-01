import { registerAs } from '@nestjs/config'

export default registerAs('logging', () => ({
  level: process.env.LOGGING_LEVEL || 'log',
}))
