import { Request, Response } from 'express'
import { RequestError } from '../errors'
import User from '../models/userModel'
import Session from '../models/sessionModel'
import objectIdIsValid from '../database/objectIdIsValid'
import createToken from '../utils/createToken'
import { registrerMail, recoverEmailTokenMail, recoverPasswordMail, validEmailMail  } from '../mails'



/**
 * Auth Controller
 */
export default {

    /**
     * Registrer a new user, send a email validation token by mail
     * @post /registrer
     * @params username, email, password, redirect
     */
    registrer : async (req: Request<{}, {}, { username: string, email: string, password: string, redirect: string }>, res: Response) => {
        const { username, email, password, redirect } = req.body
        if (await User.findOne({ username })) throw new RequestError(`Username allready exist`, 400)
        if (await User.findOne({ email })) throw new RequestError(`Email allready exist`, 400)
        const user = await User.create({ username, email, password })
        user.emailToken = createToken({user: user._id.toString()}, 'emailToken')
        user.save()
        await registrerMail({username: user.username, email: user.email, link: `${redirect}${user.emailToken}`})
            .catch(async (error) => res.status(500).json({ message: 'Mail can not be sent', error }))
        return res.status(201).json({message: 'An email has been sent with the email validation token'})
    },

    /**
     * Login a user by username or email and return access and refresh token
     * @post /login
     * @params username, email, password
     */
    login : async (req: Request<{}, {}, { username: string, email: string, password: string }>, res: Response) => {
        const { username, email, password } = req.body
        const user = await User.findOne(username ? { username } : { email })
        if (!user) throw new RequestError(`User not found`, 400)
        if (user.valid === false) throw new RequestError(`Account has not been validated`, 400)
        if (!(await user.comparePassword(password))) throw new RequestError(`Invalid password`, 400)
        const session = await Session.create({ user: user.id, userAgent: req.get("user-agent") || '' })
        const accessToken = createToken({ user: user.id, session: session.id }, "accessToken")
        const refreshToken = createToken({ user: user.id, session: session.id }, "refreshToken")
        res.status(201).json({ message: 'Session started', accessToken, refreshToken })
    },

    /**
     * Logout a user
     * @get /logout
     * @authorization
     */
    logout : async (req: Request, res: Response) => {
        const { session } = res.locals
        await Session.findByIdAndUpdate(session._id, { valid: false })
        res.status(200).json({ message: 'Session closed' })
    },

    /**
     * Session
     */
    session : async (req: Request, res: Response) => {
        const { session } = res.locals
        res.status(200).json({ message: `Session is valid`, session })
    },

    /**
     * Retrieve user informations
     * @get /
     * @authorization
     */
    show : async (req: Request, res: Response) => {
        const { session } = res.locals
        const user = await User.findById(session.user._id)
            .populate('followers', User.publicFields().join(' '))
            .populate('followings', User.publicFields().join(' '))
        res.status(200).json(user?.omit(User.privateFieldsHidden()))
    },
    
    /**
     * Update user informations
     * @put /
     * @authorization
     * @params username, password, email, about, redirect
     */
    update : async (req: Request<{}, {}, { username?: string, password?: string, email?: string, about?: string, redirect?: string }>, res: Response) => {
        const { username, password, email, about, redirect } = req.body, { session } = res.locals
        const user = await User.findById(session.user._id)
        if (!user) throw new RequestError(`Typescript is amazing`, 200)
        if (username && user.username.toString() !== username) {
            if (await User.findOne({ username })) 
                throw new RequestError(`Username allready exist`, 400)
            else user.username = username
        }
        if (password && !(await user.comparePassword(password))) {
            user.password = password
            user.passwordToken = ''
        }
        if (email && redirect && user.email.toString() !== email.toLowerCase()) {
            if (await User.findOne({ email })) 
                throw new RequestError(`Email allready exist`, 400)
            user.email = email
            user.emailCheck = false
            user.emailToken = createToken({user: user.id}, 'emailToken')
            await validEmailMail({username: user.username, email: user.email, link: `${redirect}${user.emailToken}`})
                .catch(async (error) => res.status(500).json({ message: 'Mail can not be sent', error }))
        }
        if (about) user.about = about
        await user.save()
        res.status(200).json(user.omit(User.privateFieldsHidden()))
    },

    /**
     * Upload profile or cover image
     * @post /
     * @authorization
     */
    upload : async (req: Request, res: Response) => {
        //
    },

    /**
     * Delete user
     * @delete /
     * @authorization
     */
    delete : async (req: Request, res: Response) => {
        const { session } = res.locals
        const user = await User.findById(session.user._id)
        await user?.deleteOnCascade()
        res.status(200).json({ message: 'User deleted' })
    },
    
    /**
     * Send a mail with the new email validation token, can update email if a new email is specified
     * @post /recover-email-token
     * @params username, password, email, redirect
     */
    recoverEmailToken : async (req: Request<{}, {}, { username?: string, password: string, email?: string, redirect: string }>, res: Response) => {
        const { username, password, email, redirect } = req.body
        const user = await User.findOne(username ? { username } : { email })
        if (!user) throw new RequestError(`User not found`, 400)
        if (!(await user.comparePassword(password))) throw new RequestError(`Invalid password`, 400)
        if (user.emailCheck) throw new RequestError(`Email is already valid`, 400)
        if (email && email.toLowerCase() !== user.email.toString()) user.email = email
        user.emailToken = createToken({ user: user.id }, 'emailToken')
        await recoverEmailTokenMail({username: user.username, email: user.email, link: `${redirect}${user.emailToken}`})
            .catch(async (error) => res.status(500).json({ message: 'Mail can not be sent', error }))
        await user.save()
        res.status(201).json({message: 'An email has been sent with the email validation token'})
    },

    /**
     * Valid an email and redirect user
     * @get /email-token/:emailToken
     */
    emailToken : async (req: Request<{ emailToken: string }>, res: Response) => {
        const { emailToken } = req.params
        const user = await User.findOneAndUpdate({ emailToken }, { emailCheck: true, valid: true, emailToken: '' })
        if (!user) throw new RequestError(`Invalid email token`, 400)
        return res.status(200).json({message: 'Email validated'})
    },

    /**
     * Send an authentication token
     * @post /recover-password
     * @params email, redirect
     */
    recoverPassword : async (req: Request<{}, {}, { email : string, redirect: string }>, res: Response) => {
        const { email, redirect } = req.body
        const user = await User.findOne({ email })
        if (!user) throw new RequestError(`User not found`, 400)
        user.passwordToken = createToken({ user: user.id }, 'emailToken')
        await recoverPasswordMail({username: user.username, email: user.email, link: `${redirect}${user.emailToken}`})
            .catch(async (error) => res.status(500).json({ message: 'Mail can not be sent', error }))
        user.save()
        res.status(200).json({ message: 'An email has been sent with an authentication token' })
    },

    /**
     * Authenticate user with authentication token
     * @get /authentication-token/:passwordToken
     */
    authenticationToken : async (req: Request<{ passwordToken: string }>, res: Response) => {
        const { passwordToken } = req.params
        const user = await User.findOneAndUpdate({ passwordToken }, { passwordToken: '' } )
        if (!user) throw new RequestError(`Invalid authentication token`, 400)
        const session = await Session.create({ user: user._id, userAgent: req.get("user-agent") || '' })
        const accessToken = createToken({ user: user.id, session: session.id }, "accessToken")
        const refreshToken = createToken({ user: user.id, session: session.id }, "refreshToken")
        res.status(200).json({ message: 'session started', accessToken, refreshToken })
    },

    /**
     * Add following user
     * @get /follow/:id
     * @authorization
     */
    follow : async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params, { session } = res.locals
        if (!objectIdIsValid(id)) 
            throw new RequestError(`Invalid ID`, 400)// Move in validation
        if (session.user._id.toString() === id) 
            throw new RequestError(`Can not follow himself`, 400)
        const following = await User.findByIdAndUpdate(id, { $addToSet: { followers: session.user._id } })
            .where({ valid: true })
        if (!following) 
            throw new RequestError(`User not found`, 400)
        await User.findByIdAndUpdate(session.user._id, { $addToSet: { followings: following._id } })
        res.status(200).json({ message: 'Added to following list' })
    },

    /**
     * Remove following user
     * @get /unfollow/:id
     * @authorization
     */
    unfollow : async (req: Request<{ id: string }>, res: Response) => {
        const { id } = req.params, { session } = res.locals
        if (!objectIdIsValid(id)) throw new RequestError(`Invalid ID`, 400)// Move in validation
        const following = await User.findByIdAndUpdate(id, { $unset: { followers: session.user._id } })
        if (!following) throw new RequestError(`User not found`, 400)
        await User.findByIdAndUpdate(session.user._id, { $unset: { followings: following._id } })
        res.status(200).json({ message: 'Removed to following list' })
    },
}

