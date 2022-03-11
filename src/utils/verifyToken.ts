import jwt from 'jsonwebtoken'
import config from 'config'

// export interface JwtPayload extends jwt.JwtPayload {
//     session: string
//     user: string
// }


/**
 * Verify token
 */
export default function verifyToken(
    token: string,
    keyName: 'accessToken' | 'refreshToken'
): {
    valid: boolean
    expired: boolean
    decoded: jwt.JwtPayload | null
} {
    const key = keyName === 'accessToken' ? config.get<string>('accessTokenPublicKey') : config.get<string>('refreshTokenPublicKey')
    const publicKey: jwt.Secret = Buffer.from(key, 'base64').toString('ascii')
    try {
        const tokenVerified = jwt.verify(token, publicKey)
        const decoded = typeof tokenVerified === 'string' ? null : tokenVerified
        return {
            valid: true,
            expired: false,
            decoded,
        }
    } catch (err: any) {
        const invalid = { valid: false, expired: true, decoded: null }
        if (err instanceof jwt.TokenExpiredError) invalid.expired = err.message === 'jwt expired'
        return invalid
    }
}
