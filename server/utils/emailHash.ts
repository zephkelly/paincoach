import crypto from 'crypto'

export function getEmailHash(email: string): string {
    // Convert email to lowercase and create MD5 hash
    return crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex')
  }