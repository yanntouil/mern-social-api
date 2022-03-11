import express from 'express'
import dotenv from "dotenv"
import config from 'config'
import logger from './utils/logger'
import databaseConnect from './database/connect'
import dispatchRoutes from './routes'
import handelRequestNotFound from './middelwares/handelRequestNotFound'
import handelRequestError from './middelwares/handelRequestError'
import handleCors from './middelwares/handleCors'
import deserializeSession from './middelwares/deserializeSession'

if (process.env.NODE_ENV !== 'production') dotenv.config()
const app = express()
const port = config.get<number>('port')

app.listen(port, async () => {
    logger.info(`Server is running on port ${config.get<number>('appUrl')}`)
    await databaseConnect()
    app.use(handleCors)
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    app.use(deserializeSession)
    dispatchRoutes(app)
    // app.use(handelRequestNotFound)
    // app.use(handelRequestError)
})
