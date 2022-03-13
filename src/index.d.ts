import 'express'
import { Request, Response } from 'express'
import { SessionDocument } from './schemas/sessionSchema'
import { UserDocument } from './schemas/userSchema'


interface PopulatedSessionDocument extends SessionDocument {
    user: UserDocument
}

interface ResponseLocals {
    session: PopulatedSessionDocument
}

declare module 'express' {
    interface Response  {
        locals: ResponseLocals
    }
}


