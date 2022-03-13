import mongoose, { Schema, Model, Types, Document, ObjectId } from 'mongoose'
import omit from '../utils/omit'
import likeSchema, { LikeDocument } from '../schemas/likeSchema'
import commentSchema, { CommentDocument } from '../schemas/commentSchema'
import Feed, { FeedModel } from '../models/feedModel'




/**
 * Feed Document interface
 */
export interface FeedDocument extends Document {
    _id: ObjectId
    user: ObjectId
    content: string
    medias: FeedMediaDocument[]
    likers: Types.Array<LikeDocument>
    comments: Types.Array<CommentDocument>
    createdAt: Date
    updatedAt: Date
    omit(keys: (keyof mongoose.LeanDocument<FeedDocument>)[]): {}
    deleteOnCascade: () => Promise<boolean>
}

/**
 * Media Document interface
 */
export interface FeedMediaDocument extends Document {
    type: 'image' | 'youtube'
    url: string
}

/**
 * Media schema
 */
const mediaSchema =  new Schema<FeedMediaDocument, Model<FeedMediaDocument>>({
    type: {
        type: String
    },
    url: {
        type: String
    }
})


/**
 * Feed schema
 */
const feedSchema = new Schema<FeedDocument, FeedModel>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    medias: [mediaSchema],
    comments: [commentSchema],
    likers: [likeSchema],
},{ timestamps: true })

/**
 * Document method : Omit
 */
feedSchema.methods.omit = function (keys: (keyof mongoose.LeanDocument<FeedDocument>)[]) {
    const feed = this as FeedDocument
    return omit(feed.toObject(), keys)
}

/**
 * Document method : Delete on cascad
 */
feedSchema.methods.deleteOnCascade = async function () {
    const feed = this as FeedDocument
    return Promise.all([
        Feed.findByIdAndDelete(feed.id),
        // Delete files associated
    ])
}



export default feedSchema