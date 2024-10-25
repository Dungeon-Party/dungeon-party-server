import { randomBytes } from 'crypto'
import * as argon2 from 'argon2'

const getExpirationDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString()
}

const apiKeys = [
  {
    id: 1,
    name: 'Test API Key',
    key: '',
    expiresAt: getExpirationDate(),
    userId: 1,
  },
]

export default async () => {
  for (const apiKey of apiKeys) {
    const apiKeyPrefix = randomBytes(10).toString('hex')
    const apiKeyString = randomBytes(16).toString('hex')
    const apiKeyStringHashed = await argon2.hash(apiKeyString, {
      type: argon2.argon2i,
    })
    console.log(`Generated API Key: dp-${apiKeyPrefix}.${apiKeyString}`)
    apiKey.key = `dp-${apiKeyPrefix}.${apiKeyStringHashed}`
  }

  return apiKeys
}
