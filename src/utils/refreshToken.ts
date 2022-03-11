import jwt from 'jsonwebtoken'

import SessionModel from "../models/sessionModel"
import UserModel from '../models/userModel'
import createToken from "./createToken"
import verifyToken from "./verifyToken"

interface JwtPayload extends jwt.JwtPayload {
    session: string,
    user: string,
}


/**
 * Refresh token
 */
export default async function refreshToken(refreshToken: string) {
    // Decode token
    const { decoded } = verifyToken(refreshToken, 'refreshToken')
    if (!decoded || (typeof decoded === 'string') || !decoded.session) return false
    // Check session validity
    const session = await SessionModel.findById(decoded.session)
    if (!session || !session.valid) return false
    // Check user validity
    const user = await UserModel.findById(session.user)
    if (!user) return false
    // Create a new token
    const accessToken = createToken({
        user: <string>user._id,
        session: <string>session._id,
    }, "accessToken")
    return accessToken
}