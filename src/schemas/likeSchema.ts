import mongoose, { Schema, Model, Document, ObjectId } from 'mongoose'





/**
 * LikeType Enum
 */
export enum LikeType {
    like = 'like',
    love = 'love',
    funny = 'funny',
    sad = 'sad',
    nervous = 'nervous',
    together = 'together',
}

/**
 * Interface
 */
export interface LikeDocument extends Document {
    user: ObjectId
    type: LikeType
    createdAt: Date
    updatedAt: Date
}

/**
 * Like schema
 */
const likeSchema =  new Schema<LikeDocument, Model<LikeDocument>>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: LikeType,
        default: LikeType.like,
        required: true
    },
}, { timestamps: true })

export default likeSchema