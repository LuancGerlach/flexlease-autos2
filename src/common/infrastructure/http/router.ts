import { carsRouter } from '@/cars/infrastructure/http/routes/cars.route'
import { Router } from 'express'

const routes = Router()

routes.use('/cars', carsRouter)

export { routes }
