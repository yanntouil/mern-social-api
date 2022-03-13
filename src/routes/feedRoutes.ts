import { Router } from "express"
import feedController from '../controllers/feedController'
import authenticatedRequest from "../middelwares/authenticatedRequest"
import handleRequest from '../middelwares/handleRequest'

const feedRoutes = Router()

feedRoutes.get('/', handleRequest(feedController.index))
feedRoutes.post('/', authenticatedRequest, handleRequest(feedController.create))
feedRoutes.get('/:id', handleRequest(feedController.read))
feedRoutes.put('/:id', authenticatedRequest, handleRequest(feedController.update))
feedRoutes.delete('/:id', authenticatedRequest, handleRequest(feedController.delete))
feedRoutes.get('/like/:id/:type', handleRequest(feedController.like))
feedRoutes.get('/unlike/:id', handleRequest(feedController.unlike))

export default feedRoutes