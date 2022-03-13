import mongoose, { Schema, Model, Types, Document, ObjectId } from 'mongoose'
import sessionSchema, { SessionDocument } from '../schemas/sessionSchema'




/**
 * Model interface
 */
export interface SessionModel extends Model<SessionDocument> {
    //
}


const Session = mongoose.model<SessionDocument, SessionModel>('Session', sessionSchema)

export default Session