import { Router } from 'express'
import { createCarController } from '../controllers/create-car.controller'
import { getCarController } from '../controllers/get-car.controller'
import { updateCarController } from '../controllers/update-car.controller'
import { deleteCarController } from '../controllers/delete-car.controller'
import { searchCarController } from '../controllers/search-car.controller'
import { updateAccessoryController } from '../controllers/update-acessory.controller'

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

/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: Get a car by id
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The car id
 *     responses:
 *       201:
 *         description: The car was successfully found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Car not found
 */
carsRouter.get('/:id', getCarController)

/**
 * @swagger
 * /cars/{id}:
 *   put:
 *     summary: Update a car by id
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The car id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: The car was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Input data not provided or invalid
 *       404:
 *         description: Car not found
 */
carsRouter.put('/:id', updateCarController)

/**
 * @swagger
 * /cars/{id}:
 *   delete:
 *     summary: Delete a car by id
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The car id
 *     responses:
 *       204:
 *         description: The car was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Car not found
 */
carsRouter.delete('/:id', deleteCarController)

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Returns a paginated list of cars
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 15
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: null
 *         description: Field to sort by
 *       - in: query
 *         name: sort_dir
 *         schema:
 *           type: string
 *           default: null
 *         description: Sort direction (asc or desc)
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           default: null
 *         description: Filter string to search for specific cars
 *     responses:
 *       200:
 *         description: A paginated list of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of cars
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 per_page:
 *                   type: integer
 *                   description: Number of cars per page
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 */

carsRouter.get('/', searchCarController)

/**
 * @swagger
 * /cars/{id}/acessories/{id}:
 *   patch:
 *     summary: Update an accessory of a car
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The car id
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The accessory id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: The accessory was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Input data not provided or invalid
 *       404:
 *         description: Car or accessory not found
 */
carsRouter.patch('/:idCar/acessories/:idAccessory', updateAccessoryController)

export { carsRouter }
