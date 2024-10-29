import { registerAs } from '@nestjs/config'

export default registerAs('security', () => ({
  jwt: {
    secret: process.env.SECURITY_JWT_SECRET,
    accessExpiresIn: process.env.SECURITY_JWT_ACCESS_EXPIRES,
    refreshExpiresIn: process.env.SECURITY_JWT_REFRESH_EXPIRES,
  },
}))
