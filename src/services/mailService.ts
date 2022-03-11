import nodemailer from "nodemailer"
import config from 'config'

const host = config.get<string>('mailHost')
const port = config.get<number>('mailPort')
const secure = config.get<boolean>('mailSecure')
const user = config.get<string>('mailUser')
const pass = config.get<string>('mailPassword')
const requireTLS = config.get<boolean>('mailRequireTLS')

const nodemaileConfig = { host, port, secure, auth: { user, pass }, requireTLS }
const mailService = nodemailer.createTransport(nodemaileConfig)

export default mailService