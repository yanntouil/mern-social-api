import { Request, Response, NextFunction } from 'express'
import RequestError from '../errors/RequestError'
import logger from '../utils/logger'

interface HandelRequestError {
    (err: RequestError, req: Request, res: Response): void
}

/**
 * errorHandler
 */
const handelRequestError: HandelRequestError = (err, req, res) => {
    res.status(err.statusCode ?? 500)
    if (process.env.NODE_ENV === 'production')
        return res.json({ message: err.message })
    res.json({ 
        message: err.message,
        error: {
            statusCode: err.statusCode,
            type: err.type,
            code: err.errorCode,
            stack: err.stack?.split('\n')
        },
    })
    logger.error({
        statusCode: err.statusCode,
        type: err.type,
        code: err.errorCode,
        stack: err.stack?.split('\n')
    }, err.message)
}

export default handelRequestError


