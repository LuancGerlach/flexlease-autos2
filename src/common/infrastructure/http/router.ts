import { carsRouter } from '@/cars/infrastructure/http/routes/cars.route'
import { Router } from 'express'

const routes = Router()

routes.get('/', (req, res) => {
  return res.status(200).json({ message: 'Olá Mundo!' })
})

routes.use('/cars', carsRouter)

export { routes }
