import { CarsTypeormRepository } from './cars-typeorm.repository'
import { Car } from '../entities/cars.entity'
import { testDataSource } from '@/common/infrastructure/typeorm/testing/data-source'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { CarsDataBuilder } from '@/cars/infrastructure/testing/helpers/cars-data-builder'
import { randomUUID } from 'node:crypto'

describe('CarsTypeormRepository Integration Tests', () => {
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

  describe('findAllByModel', () => {
    it('should return cars with the specified model', async () => {
      const car1 = CarsDataBuilder({ model: 'ModelX' })
      const car2 = CarsDataBuilder({ model: 'ModelX' })
      await ormRepository.insert(car1)
      await ormRepository.insert(car2)

      const result = await ormRepository.findAllByModel('ModelX')

      expect(result).toHaveLength(2)
    })

    it('should throw NotFoundError if no cars with the specified model are found', async () => {
      const model = 'ModelX'
      await expect(ormRepository.findAllByModel(model)).rejects.toThrow(
        new NotFoundError(`Car not found using model ${model}`),
      )
    })
  })

  describe('findAllById', () => {
    it('should return cars with the specified ids', async () => {
      const carsIds = [
        { id: 'e0b242a9-9606-4b25-ad24-8e6e2207ae45' },
        { id: randomUUID() },
      ]
      const car1 = CarsDataBuilder({ id: carsIds[0].id })
      const car2 = CarsDataBuilder({ id: randomUUID() })
      await ormRepository.insert(car1)
      await ormRepository.insert(car2)

      const result = await ormRepository.findAllById(carsIds)

      expect(result).toHaveLength(1)
    })

    it('should return an empty array if no cars with the specified ids are found', async () => {
      const result = await ormRepository.findAllById([
        { id: randomUUID() },
        { id: randomUUID() },
      ])

      expect(result).toEqual([])
    })
  })

  describe('create', () => {
    it('should create a new car', () => {
      const car = CarsDataBuilder({ model: 'ModelX', id: randomUUID() })
      const result = ormRepository.create(car)
      expect(result.model).toEqual(car.model)
    })
  })

  describe('insert', () => {
    it('should insert a car into the repository', async () => {
      const id = randomUUID()
      const car = CarsDataBuilder({ id: id, model: 'ModelX' })
      await ormRepository.insert(car)

      const foundCar = await ormRepository.findById(id)
      expect(foundCar.id).toEqual(id)
    })
  })

  describe('findById', () => {
    it('should return a car by id', async () => {
      const car = CarsDataBuilder({ id: randomUUID(), model: 'ModelX' })
      await ormRepository.insert(car)

      const foundCar = await ormRepository.findById(car.id)
      expect(foundCar.id).toEqual(car.id)
    })

    it('should throw NotFoundError if no car with the specified id is found', async () => {
      await expect(ormRepository.findById(randomUUID())).rejects.toThrow(
        NotFoundError,
      )
    })
  })

  describe('update', () => {
    it('should update a car', async () => {
      const car = CarsDataBuilder({ model: 'ModelX' })
      await ormRepository.insert(car)

      car.model = 'UpdatedModel'
      const updatedCar = await ormRepository.update(car)

      expect(updatedCar.model).toBe('UpdatedModel')
    })

    it('should generate an error when the car is not found', async () => {
      const data = CarsDataBuilder({})
      await expect(ormRepository.update(data)).rejects.toThrow(
        new NotFoundError(`No cars found using id ${data.id}`),
      )
    })
  })

  describe('delete', () => {
    it('should delete a car by id', async () => {
      const car = CarsDataBuilder({ model: 'ModelX' })
      await ormRepository.insert(car)

      await ormRepository.delete(car.id)

      await expect(ormRepository.findById(car.id)).rejects.toThrow(
        NotFoundError,
      )
    })

    it('should generate an error when the car is not found', async () => {
      const id = randomUUID()
      await expect(ormRepository.delete(id)).rejects.toThrow(
        new NotFoundError(`No cars found using id ${id}`),
      )
    })
  })

  describe('search', () => {
    it('should apply only pagination when the other params are null', async () => {
      const arrange = Array(16).fill(CarsDataBuilder({}))
      arrange.map(element => delete element.id)
      const data = testDataSource.manager.create(Car, arrange)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: 'fake',
        sort_dir: null,
        filter: null,
      })

      expect(result.total).toEqual(16)
      expect(result.items.length).toEqual(15)
      expect(result.sort).toEqual('created_at')
    })

    it('should order by created_at DESC when search params are null', async () => {
      const created_at = new Date()
      const models: Car[] = []
      const arrange = Array(16).fill(CarsDataBuilder({}))
      arrange.forEach((element, index) => {
        delete element.id
        models.push({
          ...element,
          model: `Car ${index}`,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Car, models)
      await testDataSource.manager.save(data)

      const result = await ormRepository.search({
        page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
      })

      expect(result.items[0].model).toEqual('Car 15')
      expect(result.items[14].model).toEqual('Car 1')
    })

    it('should apply paginate and sort', async () => {
      const created_at = new Date()
      const models: Car[] = []
      'badec'.split('').forEach((element, index) => {
        models.push({
          ...CarsDataBuilder({}),
          model: element,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Car, models)
      await testDataSource.manager.save(data)

      let result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'model',
        sort_dir: 'ASC',
        filter: null,
      })

      expect(result.items[0].model).toEqual('a')
      expect(result.items[1].model).toEqual('b')
      expect(result.items.length).toEqual(2)

      result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'model',
        sort_dir: 'DESC',
        filter: null,
      })

      expect(result.items[0].model).toEqual('e')
      expect(result.items[1].model).toEqual('d')
      expect(result.items.length).toEqual(2)
    })

    it('should search using filter, sort and paginate', async () => {
      const created_at = new Date()
      const models: Car[] = []
      const values = ['test', 'a', 'TEST', 'b', 'TeSt']
      values.forEach((element, index) => {
        models.push({
          ...CarsDataBuilder({}),
          model: element,
          created_at: new Date(created_at.getTime() + index),
        })
      })
      const data = testDataSource.manager.create(Car, models)
      await testDataSource.manager.save(data)

      let result = await ormRepository.search({
        page: 1,
        per_page: 2,
        sort: 'model',
        sort_dir: 'ASC',
        filter: 'TEST',
      })

      expect(result.items[0].model).toEqual('test')
      expect(result.items[1].model).toEqual('TeSt')
      expect(result.items.length).toEqual(2)
      expect(result.total).toEqual(3)

      result = await ormRepository.search({
        page: 2,
        per_page: 2,
        sort: 'model',
        sort_dir: 'ASC',
        filter: 'TEST',
      })

      expect(result.items[0].model).toEqual('TEST')
      expect(result.items.length).toEqual(1)
      expect(result.total).toEqual(3)
    })
  })
})
