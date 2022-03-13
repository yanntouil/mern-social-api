import mongoose, { Model } from 'mongoose'
import feedSchema, { FeedDocument } from '../schemas/feedSchema'

/**
 * Feed Model interface
 */
export interface FeedModel extends Model<FeedDocument> {
    publicFields: () => (keyof mongoose.LeanDocument<FeedDocument>)[]
    privateFieldsHidden: () => (keyof mongoose.LeanDocument<FeedDocument>)[]
}

/**
 * Model method : publicFields
 */
feedSchema.static(
    'publicFields', 
    (): (keyof mongoose.LeanDocument<FeedDocument>)[] => 
        ['id', 'user', 'content', 'medias', 'likers', 'comments', 'createdAt', 'updatedAt']
)

/**
 * Model method : privateFieldsHidden
 */
feedSchema.static(
    'privateFieldsHidden', 
    (): (keyof mongoose.LeanDocument<FeedDocument>)[] => 
        []
)

const FeedModel = mongoose.model<FeedDocument, FeedModel>("Feed", feedSchema)
export default FeedModel