import mongoose, { Schema, Types, Document, ObjectId } from 'mongoose'
import bcrypt from 'bcrypt'
import config from 'config'
import omit from '../utils/omit'
import Session from '../models/sessionModel'
import User, { UserModel } from '../models/userModel'

/**
 * Document interface
 */
export interface UserDocument extends Document {
    _id: ObjectId
    username: string
    password: string
    email: string
    passwordToken: string
    valid: boolean
    emailCheck: boolean
    emailToken: string
    about: string
    coverPicture: string
    profilePicture: string
    followers: Types.Array<ObjectId>
    followings: Types.Array<ObjectId>
    createdAt: Date
    updatedAt: Date
    comparePassword(password: string): Promise<Boolean>
    omit(keys: (keyof mongoose.LeanDocument<UserDocument>)[]): {}
    deleteOnCascade: () => Promise<boolean>
}

/**
 * Schema
 */
const userSchema = new Schema<UserDocument, UserModel>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    passwordToken: {
        type: String,
        default: '',
    },
    valid: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    emailCheck: {
        type: Boolean,
        default: false,
    },
    emailToken: {
        type: String,
    },
    about: {
        type: String,
        default: '',
        trim: true,
    },
    coverPicture: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    followings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    },{ timestamps: true })

/**
 * Before save
 */
userSchema.pre("save", async function(next) {
    const user = this as UserDocument
    if (!user.isModified("password")) return next()// Not modified => next
    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"))
    const hash = bcrypt.hashSync(user.password, salt)
    user.password = hash
    next()
})

/**
 * Document method : Compare password
 */
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    const user = this as UserDocument
    return bcrypt.compare(password, user.password).catch((_) => false)
}

/**
 * Document method : Omit
 */
userSchema.methods.omit = function (keys: (keyof mongoose.LeanDocument<UserDocument>)[]) {
    const user = this as UserDocument
    return omit(user.toObject(), keys)
}

/**
 * Document method : Delete on cascad
 */
userSchema.methods.deleteOnCascade = async function () {
    const user = this as UserDocument
    return Promise.all([
        User.findByIdAndDelete(user.id),
        Session.deleteMany({ user: user.id }),
        // Delete files associated
    ])
}

export default userSchema