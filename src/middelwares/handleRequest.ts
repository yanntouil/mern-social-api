import e, { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

interface HandleRequest {
    (fn: (req: Request<any, any, any>, res: Response, next: NextFunction) => void): (
        req: Request,
        res: Response,
        next: NextFunction
    ) => void
}

/**
 * Handle request
 */
const handleRequest: HandleRequest =
    fn => (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(err => {
            res.status(err.statusCode ?? 500)
            if (process.env.NODE_ENV === 'production')
                return res.json({ message: err.message })
            res.json({
                message: err.message,
                error: {
                    statusCode: err.statusCode,
                    type: err.type,
                    code: err.errorCode,
                    stack: err.stack?.split('\n'),
                },
            })
            logger.error(
                {
                    statusCode: err.statusCode,
                    type: err.type,
                    code: err.errorCode,
                    stack: err.stack?.split('\n'),
                },
                err.message
            )
        })

export default handleRequest
