import 'express'
import { Request, Response } from 'express'
import { SessionDocument } from './models/sessionModel'
import { UserDocument } from './models/userModel'


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


