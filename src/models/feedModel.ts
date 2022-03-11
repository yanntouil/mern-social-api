import mongoose, { Schema, Model, Types, Document, ObjectId } from 'mongoose'

import config from 'config'
import omit from '../utils/omit'




/**
 * Document interface
 */
export interface FeedDocument extends Document {
    _id: ObjectId
    user: ObjectId
    message: string
    medias: FeedMediaDocument[]
    likers: Types.Array<ObjectId>
    createdAt: Date
    updatedAt: Date
    omit(keys: (keyof mongoose.LeanDocument<FeedDocument>)[]): {}
    deleteOnCascade: () => Promise<boolean>
}
export interface FeedMediaDocument extends Document {
    type: 'image' | 'youtube'
    url: string
}

/**
 * Model interface
 */
export interface FeedModel extends Model<FeedDocument> {
    publicFields: () => (keyof mongoose.LeanDocument<FeedDocument>)[]
    privateFieldsHidden: () => (keyof mongoose.LeanDocument<FeedDocument>)[]
}

/**
 * Schema
 */
const feedMediaSchema =  new Schema<FeedMediaDocument, Model<FeedMediaDocument>>({
    type: {
        type: String
    },
    url: {
        type: String
    }
})
const schema = new Schema<FeedDocument, FeedModel>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        medias: [feedMediaSchema],
        likers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
    },
    { timestamps: true }
)



/**
 * Document method : Omit
 */
schema.methods.omit = function (keys: (keyof mongoose.LeanDocument<FeedDocument>)[]) {
    const feed = this as FeedDocument
    return omit(feed.toObject(), keys)
}

/**
 * Document method : Delete on cascad
 */
schema.methods.deleteOnCascade = async function () {
    const feed = this as FeedDocument
    return Promise.all([
        FeedModel.findByIdAndRemove(feed.id),
        // Delete files
    ])
}

/**
 * Model method : Delete on cascad
 */
schema.static(
    'publicFields', 
    (): (keyof mongoose.LeanDocument<FeedDocument>)[] => 
        ['id', 'message', 'medias', 'likers', 'createdAt', 'updatedAt']
)


/**
 * Model method : privateFieldsHidden
 */
schema.static(
    'privateFieldsHidden', 
    (): (keyof mongoose.LeanDocument<FeedDocument>)[] => 
        []
)


const FeedModel = mongoose.model<FeedDocument, FeedModel>("Feed", schema)
export default FeedModel