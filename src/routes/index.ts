import { Express, Request, Response } from 'express'
import userRoutes from './userRoutes'
import authRoutes from './authRoutes'





/**
 * Dispatch routes
 */
export default function dispatchRoutes(app: Express) {
    app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200))
    app.use('/auth', authRoutes)
    app.use('/user', userRoutes)
}