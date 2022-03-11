import mongoose, { Schema, Model, Types, Document, ObjectId } from 'mongoose'



/**
 * Document interface
 */
export interface SessionDocument extends Document {
    _id: ObjectId
    user: ObjectId
    valid: boolean,
    userAgent: string,
    createdAt: Date
    updatedAt: Date
}

/**
 * Model interface
 */
export interface SessionModel extends Model<SessionDocument> {
    //
}

/**
 * Schema
 */
const schema = new Schema<SessionDocument, SessionModel>({
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

const Session = mongoose.model<SessionDocument, SessionModel>('Session', schema)
export default Session
