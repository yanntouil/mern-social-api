import { Request, Response, NextFunction } from 'express'
import RequestError from '../errors/RequestError'
import User from '../models/userModel'
import objectIdIsValid from '../database/objectIdIsValid'


/**
 * User Controller
 */
export default {
    /**
     * Index
     */
    index : async (req: Request, res: Response) => {
        const users = await User.find()
            .populate('followers', User.publicFields())
            .populate('followings', User.publicFields())
            .where({ valid: true })
            .select(User.publicFields())
        res.status(200).json(users)
    },
    /**
     * Read
     */
    show : async (req: Request, res: Response) => {
        const { id } = req.params
        if (!objectIdIsValid(id)) throw new RequestError(`Invalid ID`, 400)
        const user = await User.findById(id)
            .populate('followers', User.publicFields())
            .populate('followings', User.publicFields())
            .select(User.publicFields())
        if (!user) throw new RequestError(`User not found`, 400)
        res.status(200).json(user)
    },  
}

