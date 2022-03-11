import { Router } from "express"
import userController from '../controllers/userController'
import authenticatedRequest from "../middelwares/authenticatedRequest"
import handleRequest from '../middelwares/handleRequest'

const userRoutes = Router()

userRoutes.get('/', handleRequest(userController.index))
userRoutes.get('/:id', handleRequest(userController.show))

export default userRoutes