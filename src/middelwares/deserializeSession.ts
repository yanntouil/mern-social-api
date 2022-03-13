import { Request, Response, NextFunction } from 'express'
import verifyToken from '../utils/verifyToken'
import refreshToken from '../utils/refreshToken'
import SessionModel from '../models/sessionModel'
import { PopulatedSessionDocument } from '..'
import User from '../models/userModel'

export default async function deserializeSession(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Get access token
    const accessToken = (req.headers['authorization'] ?? '').replace(/^Bearer\s/, '')
    if (!accessToken) return next()
    // Get refresh token
    const xRefreshToken = Array.isArray(req.headers['x-refresh'])
        ? req.headers['x-refresh'][0]
        : req.headers['x-refresh']
    let { expired, decoded } = verifyToken(accessToken, 'accessToken')
    if (!decoded && expired && xRefreshToken) {
        const newAccessToken = await refreshToken(xRefreshToken)
        if (newAccessToken) {
            res.setHeader('x-access-token', newAccessToken)
            decoded = verifyToken(newAccessToken, 'accessToken')?.decoded
        }
    }
    if (decoded) {
        // ? Populate generate an error if user does not exist,
        // ? this avoids creating a session if the user no longer exists
        try {
            const session = await SessionModel.findById<PopulatedSessionDocument>(decoded.session)
                .populate('user', User.privateFieldsHidden().join(' '))
            if (session?.valid && session.user) res.locals = { ...res.locals, session }
        } catch (_) {}
    }
    next()
}
