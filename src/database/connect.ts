import mongoose from 'mongoose'
import config from 'config'
import logger from '../utils/logger'

/**
 * Database connection
 */
export default async function connect() {
    const dbUri = config.get<string>('databaseUri')
    try {
        await mongoose.connect(dbUri)
        logger.info('Server is connected to the database')
    } catch (error) {
        logger.error('Failed to connect server to th database')
        process.exit(1)
    }
}