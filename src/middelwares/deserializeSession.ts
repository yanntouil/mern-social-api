import { Request, Response, NextFunction } from 'express'
import verifyToken from '../utils/verifyToken'
import refreshToken from '../utils/refreshToken'
import SessionModel, { SessionDocument } from '../models/sessionModel'
import { userPrivateFieldsHidden } from '../models/userModel'
import mongoose from 'mongoose'

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
        await SessionModel.findById(
            decoded.session,
            (err: mongoose.CallbackError, session: SessionDocument | null) => {
                if (!err && session?.valid && session.user)
                    res.locals = { ...res.locals, session }
            }
        ).populate('user', userPrivateFieldsHidden)
    }
    next()
}
