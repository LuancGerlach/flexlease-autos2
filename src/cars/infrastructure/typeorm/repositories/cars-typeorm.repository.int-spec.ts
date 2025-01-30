import { testDataSource } from '@/common/infrastructure/typeorm/testing/data-source'
import { CarsTypeormRepository } from './cars-typeorm.repository'
import { Car } from '../entities/cars.entity'
import { CarsDataBuilder } from '../../testing/helpers/cars-data-builder'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { CarModel } from '@/cars/domain/models/cars.model'

describe('CarsTypeormRepository integration tests', () => {
  let ormRepository: CarsTypeormRepository

  beforeAll(async () => {
    await testDataSource.initialize()
  })

  afterAll(async () => {
    await testDataSource.destroy()
  })

  beforeEach(async () => {
    await testDataSource.manager.query('DELETE FROM cars')
    ormRepository = new CarsTypeormRepository()
    ormRepository.carsRepository = testDataSource.getRepository(Car)
  })
})
