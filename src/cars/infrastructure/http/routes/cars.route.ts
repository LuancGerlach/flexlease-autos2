import { Router } from 'express'
import { createCarController } from '../controllers/create-car.controller'

const carsRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - model
 *         - year
 *         - valuePerDay
 *         - numberOfPassengers
 *         - accessories
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id (uuid) of the car
 *         model:
 *           type: string
 *           description: The model of the car
 *         year:
 *           type: string
 *           description: The year of the car
 *         valuePerDay:
 *           type: number
 *           description: The rental value per day of the car
 *         numberOfPassengers:
 *           type: number
 *           description: The number of passengers the car can hold
 *         accessories:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The auto-generated id (uuid) of the accessory
 *               description:
 *                 type: string
 *                 description: The description of the accessory
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the car was added
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the car was last updated
 *       example:
 *         id: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *         model: ModelX
 *         year: "2020"
 *         valuePerDay: 100
 *         numberOfPassengers: 4
 *         accessories:
 *           - id: 1
 *             description: Air Conditioning
 *           - id: 2
 *             description: GPS
 *         created_at: 2023-01-01T10:00:00Z
 *         updated_at: 2023-01-01T10:00:00Z
 */
/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: The cars managing API
 */
/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Create a new car
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: The car was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Input data not provided or invalid
 */
carsRouter.post('/', createCarController)

export { carsRouter }
