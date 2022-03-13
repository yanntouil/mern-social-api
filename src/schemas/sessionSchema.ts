import mongoose, { Schema, Document, ObjectId } from 'mongoose'
import { SessionModel } from '../models/sessionModel'
import { UserDocument } from './userSchema'




/**
 * Document interface
 */
export interface SessionDocument extends Document {
    _id: ObjectId
    user: ObjectId,
    valid: boolean,
    userAgent: string,
    createdAt: Date
    updatedAt: Date
}

/**
 * Schema
 */
const sessionSchema = new Schema<SessionDocument, SessionModel>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    valid: {
        type: Boolean,
        default: true,
    },
    userAgent: {
        type: String,
    },
},{ timestamps: true })

export default sessionSchema