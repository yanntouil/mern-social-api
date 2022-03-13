import mongoose, {  Model } from 'mongoose'
import userSchema, { UserDocument } from '../schemas/userSchema'




/**
 * Model interface
 */
export interface UserModel extends Model<UserDocument> {
    publicFields: () => (keyof mongoose.LeanDocument<UserDocument>)[]
    privateFieldsHidden: () => (keyof mongoose.LeanDocument<UserDocument>)[]
}

/**
 * Model method : Delete on cascad
 */
userSchema.static(
    'publicFields', 
    (): (keyof mongoose.LeanDocument<UserDocument>)[] => 
        ['id', 'username', 'followers', 'followings', 'valid', 'createdAt', 'updatedAt']
)

/**
 * Model method : privateFieldsHidden
 */
userSchema.static(
    'privateFieldsHidden', 
    (): (keyof mongoose.LeanDocument<UserDocument>)[] => 
        ['password', 'passwordToken', 'emailToken']
)

const User = mongoose.model<UserDocument, UserModel>("User", userSchema)
export default User