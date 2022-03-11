import { Request, Response, NextFunction } from 'express'

interface HandelRequestNotFound {
    (req: Request, res: Response, next: NextFunction): void
}

/**
 * 
 */
const handelRequestNotFound: HandelRequestNotFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

export default handelRequestNotFound