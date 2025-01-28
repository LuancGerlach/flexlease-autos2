import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { env } from '../env'

const dataSource = new DataSource({
  type: env.DB_TYPE,
  url: env.DB_CONNECTION,
  entities: ['**/entities/**/*.ts'],
  migrations: ['**/migrations/**/*.ts'],
  synchronize: false,
  logging: false,
})

export { dataSource }
