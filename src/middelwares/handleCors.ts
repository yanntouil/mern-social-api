import config from 'config'
import cors from 'cors'


const handleCors = cors({
    origin: config.get<string|boolean|RegExp|(string|boolean|RegExp)[]>('corsOrigin'),
    credentials: true,
    allowedHeaders: ['sessionId', 'Content-Type'],
    exposedHeaders: ['sessionId'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
})

export default handleCors