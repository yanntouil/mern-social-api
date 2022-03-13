import { Request, Response } from 'express'
import { RequestError } from '../errors'
import objectIdIsValid from '../database/objectIdIsValid'
import Feed from '../models/feedModel'
import { LikeType } from '../schemas/likeSchema'
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
            .populate('likes', User.publicFields().join(' '))
        res.status(200).json(feeds)
    },

    /**
     * Create
     * @post /
     * @params  content: string
     */
    create : async (req: Request<{}, {}, { content: string }>, res: Response) => {
        const { session } = res.locals, { content } = req.body
        const feed = await Feed.create({ user: session.user._id, content })
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
            .populate('likers', User.publicFields().join(' '))
        if (!feed) throw new RequestError(`Feed not found`, 404)
        res.status(200).json(feed)
    },

    /**
     * Update
     * @put /:id
     * @params  content?: string
     */
    update : async (req: Request<{ id: string }, {}, { content?: string }>, res: Response) => {
        const { session } = res.locals, { id } = req.params, { content } = req.body
        if (!objectIdIsValid(id)) throw new RequestError(`Invalid ID`, 400)
        const feed = await Feed.findById(id)
            .where({ user: session.user._id })
            .populate('user', User.publicFields().join(' '))
        if (!feed) throw new RequestError(`Feed not found`, 404)
        if (content) feed.content = content
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
    /**
     * Like
     * @get /:id/:type
     */
    like : async (req: Request<{ id: string, type: LikeType }, {}, {}>, res: Response) => {
        const { session } = res.locals, { id, type } = req.params
        if (!objectIdIsValid(id)) throw new RequestError(`Invalid ID`, 400)
        await Feed.findByIdAndUpdate(id, { $pull: { likers: { user: session.user._id } } })// Remove before add if allready exist
        const feed = await Feed.findByIdAndUpdate(id, { $push: { likers: { user: session.user._id, type } } })
        if (!feed) throw new RequestError(`Feed not found`, 400)
        res.status(200).json({ message: 'Feed has been liked' })
    },
    /**
     * Unlike
     * @get /:id
     */
    unlike : async (req: Request<{ id: string }, {}, {}>, res: Response) => {
        const { session } = res.locals, { id } = req.params
        if (!objectIdIsValid(id)) throw new RequestError(`Invalid ID`, 400)
        const feed = await Feed.findByIdAndUpdate(id, { $pull: { likers: { user: session.user._id } } })
        if (!feed) throw new RequestError(`Feed not found`, 400)
        res.status(200).json({ message: 'Feed has been unliked' })
    },

}


