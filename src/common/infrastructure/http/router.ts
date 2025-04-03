import { Router } from 'express'
import { carsRouter } from '@/cars/infrastructure/http/routes/cars.route'
import { usersRouter } from '@/users/infrastructure/http/routes/users.route'

const routes = Router()

routes.use('/cars', carsRouter)
routes.use('/users', usersRouter)

export { routes }
