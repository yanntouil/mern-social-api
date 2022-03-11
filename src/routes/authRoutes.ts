import { Router } from "express"
import authController from '../controllers/authController'
import authenticatedRequest from "../middelwares/authenticatedRequest"
import handleRequest from '../middelwares/handleRequest'


/**
 * Routes
 */
const authRoutes = Router()

authRoutes.post('/registrer', handleRequest(authController.registrer))
authRoutes.post('/login', handleRequest(authController.login))
authRoutes.get('/logout', authenticatedRequest, handleRequest(authController.logout))
authRoutes.get('/session', authenticatedRequest, handleRequest(authController.session))

authRoutes.get('/', authenticatedRequest, handleRequest(authController.show))
authRoutes.put('/', authenticatedRequest, handleRequest(authController.update))
authRoutes.post('/', authenticatedRequest, handleRequest(authController.upload))
authRoutes.delete('/', authenticatedRequest, handleRequest(authController.delete))

authRoutes.post('/recover-email-token', handleRequest(authController.recoverEmailToken))
authRoutes.get('/email-token/:emailToken', handleRequest(authController.emailToken))

authRoutes.post('/recover-password', handleRequest(authController.recoverPassword))
authRoutes.get('/authentication-token/:passwordToken', handleRequest(authController.authenticationToken))

authRoutes.get('/follow/:id', authenticatedRequest, handleRequest(authController.follow))
authRoutes.get('/unfollow/:id', authenticatedRequest, handleRequest(authController.unfollow))

export default authRoutes
