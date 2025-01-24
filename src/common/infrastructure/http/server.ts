import { app } from './app'
import { env } from '../env'
import { dataSource } from '../typeorm'

dataSource
  .initialize()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`)
      console.log('API Docs available at GET /docs')
    })
  })
  .catch(error => console.log(error))
