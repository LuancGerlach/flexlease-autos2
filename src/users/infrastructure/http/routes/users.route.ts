import { Router } from 'express'
import { createUserController } from '../controllers/create-user.controller'

const usersRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - cpf
 *         - birth
 *         - email
 *         - password
 *         - cep
 *         - qualified
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id (uuid) of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         cpf:
 *           type: string
 *           description: The CPF of the user
 *         birth:
 *           type: string
 *           description: The birth date of the user (DD/MM/YYYY format)
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The encrypted password of the user
 *         cep:
 *           type: string
 *           description: The CEP (postal code) of the user
 *         qualified:
 *           type: string
 *           description: Whether the user is qualified ("sim" or "não")
 *         patio:
 *           type: string
 *           description: The street address of the user
 *         complement:
 *           type: string
 *           description: Additional address information
 *         neighborhood:
 *           type: string
 *           description: The neighborhood of the user
 *         locality:
 *           type: string
 *           description: The city of the user
 *         uf:
 *           type: string
 *           description: The state of the user
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the user was added
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the user was last updated
 *       example:
 *         id: 7ae9a965-cc89-4c54-bd78-2e117ec3f73a
 *         name: Luan Gerlach
 *         cpf: 931.662.070-82
 *         birth: 26/08/2005
 *         email: lakiesha6404@uorak.com
 *         password: $2b$08$wdZHoelF3R3klW.Vpjr3uu8mtXj1x5rCfbUKncdxaht4.6lGUV5Ti
 *         cep: 98780-007
 *         qualified: sim
 *         patio: Rua São Salvador
 *         complement: ""
 *         neighborhood: Centro
 *         locality: Santa Rosa
 *         uf: RS
 *         created_at: 2025-04-03T17:34:40.928Z
 *         updated_at: 2025-04-03T17:34:40.928Z
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Input data not provided or invalid
 *       409:
 *         description: Email already used on another user
 */
usersRouter.post('/', createUserController)

export { usersRouter }
