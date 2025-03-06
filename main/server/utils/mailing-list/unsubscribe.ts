import crypto from 'crypto'

/**
 * Generates an MD5 hash of the email address for Mailchimp API
 */
export function getEmailHash(email: string): string {
    // Convert email to lowercase and create MD5 hash
    return crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex')
}

/**
 * Generates a secure unsubscribe token based on email and timestamp
 */
export function generateEmailToken(email: string): string {
    const timestamp = Date.now().toString()
    return crypto
      .createHash('sha256')
      .update(email.toLowerCase() + timestamp + 'mailing-list-salt')
      .digest('hex')
}