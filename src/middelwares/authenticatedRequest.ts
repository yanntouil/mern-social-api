import { Request, Response, NextFunction } from 'express'
import RequestError from '../errors/RequestError'
import handleRequest from './handleRequest'








export default async function authenticatedRequest(req: Request, res: Response, next: NextFunction) {
    if (res.locals?.session?.valid) next()
    else res.status(401).json({ message: 'Unauthorized request' })
}