import express from 'express'
import cors from 'cors'
import { routes } from './router'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)
app.use(errorHandler)

export { app }
