import { Router } from 'express'
import { createCarController } from '../controllers/create-car.controller'

const carsRouter = Router()

carsRouter.post('/', createCarController)

export { carsRouter }
