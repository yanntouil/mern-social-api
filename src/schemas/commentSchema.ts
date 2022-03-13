import mongoose, { Schema, Model, Types, Document, ObjectId } from 'mongoose'
import likeSchema, { LikeDocument } from '../schemas/likeSchema'




/**
 * Comment Document interface
 */
export interface CommentDocument extends Document {
    user: ObjectId
    content: string
    likers: Types.Array<LikeDocument>
    comments: Types.Array<CommentDocument>
    createdAt: Date
    updatedAt: Date
}

/**
 * Comment schema
 */
const commentSchema =  new Schema<CommentDocument, Model<CommentDocument>>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String
    },
    likers: [likeSchema],
}, { timestamps: true })
commentSchema.add({comments: [commentSchema]})

export default commentSchema