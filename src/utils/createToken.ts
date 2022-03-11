import jwt from 'jsonwebtoken'
import config from 'config'

/**
 * Create token
 */
export default function createToken(
    payload: { user: string, session: string } | { user: string },
    keyName: 'accessToken' | 'refreshToken' | 'emailToken',
    options: jwt.SignOptions = {}
): string {
    const expiresIn = config.get<string>(`${keyName}Ttl`)
    const encodedKey = config.get<string>(`${keyName}PrivateKey`)
    const privateKey: jwt.Secret = Buffer.from(encodedKey, 'base64').toString('ascii')
    return jwt.sign(payload, privateKey, {
        ...options,
        algorithm: 'RS256',
        expiresIn,
    })
}
