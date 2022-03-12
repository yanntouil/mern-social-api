import { Request, Response } from 'express'
import { RequestError } from '../errors'
import objectIdIsValid from '../database/objectIdIsValid'
import Feed from '../models/feedModel'
import User from '../models/userModel'



/**
 * Feed Controller
 */
export default {

    /**
     * index
     * @get /
     */
    index : async (req: Request, res: Response) => {
        const feeds = await Feed.find()
            .select(Feed.publicFields())
            .populate('user', User.publicFields().join(' '))
        res.status(200).json(feeds)
    },

    /**
     * Create
     * @post /
     * @params  message: string
     */
    create : async (req: Request<{}, {}, { message: string }>, res: Response) => {
        const { session } = res.locals, { message } = req.body
        const feed = await Feed.create({ user: session.user._id, message })
        res.status(200).json(feed)
    },

    /**
     * Read
     * @get /:id
     */
    read : async (req: Request<{ id: string }, {}, {}>, res: Response) => {
        const { id } = req.params
        if (!objectIdIsValid(id)) throw new RequestError(`Invalid ID`, 400)
        const feed = await Feed.findById(id)
            .select(Feed.publicFields())
            .populate('user', User.publicFields().join(' '))
        if (!feed) throw new RequestError(`Feed not found`, 404)
        res.status(200).json(feed)
    },

    /**
     * Update
     * @put /:id
     * @params  message?: string
     */
    update : async (req: Request<{ id: string }, {}, { message?: string }>, res: Response) => {
        const { session } = res.locals, { id } = req.params, { message } = req.body
        if (!objectIdIsValid(id)) throw new RequestError(`Invalid ID`, 400)
        const feed = await Feed.findById(id)
            .where({ user: session.user._id })
            .populate('user', User.publicFields().join(' '))
        if (!feed) throw new RequestError(`Feed not found`, 404)
        if (message) feed.message = message
        await feed.save()
        res.status(200).json(feed)
    },

    /**
     * Delete
     * @delete /:id
     */
    delete : async (req: Request<{ id: string }, {}, {}>, res: Response) => {
        const { session } = res.locals, { id } = req.params
        if (!objectIdIsValid(id)) throw new RequestError(`Invalid ID`, 400)
        const feed = await Feed.findById(id)
            .where({ user: session.user._id })
        if (!feed) throw new RequestError(`Feed not found`, 404)
        await feed.deleteOnCascade()
        res.status(200).json({ message: 'Feed deleted' })
    },
}


