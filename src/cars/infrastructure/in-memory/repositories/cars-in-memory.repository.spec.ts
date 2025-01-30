import { CarsInMemoryRepository } from './cars-in-memory.repository'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { CarsDataBuilder } from '@/cars/infrastructure/testing/helpers/cars-data-builder'

describe('CarsInMemoryRepository units tests', () => {
  let sut: CarsInMemoryRepository

  beforeEach(() => {
    sut = new CarsInMemoryRepository()
  })

  describe('findAllByModel', () => {
    it('should return cars with the specified model', async () => {
      const car1 = CarsDataBuilder({ model: 'ModelX' })
      const car2 = CarsDataBuilder({ model: 'ModelX' })
      sut.items = [car1, car2]

      const result = await sut.findAllByModel('ModelX')

      expect(result).toEqual([car1, car2])
    })

    it('should throw NotFoundError if no cars with the specified model are found', async () => {
      await expect(sut.findAllByModel('NonExistentModel')).rejects.toThrow(
        NotFoundError,
      )
    })
  })

  describe('findAllById', () => {
    it('should return cars with the specified ids', async () => {
      const car1 = CarsDataBuilder({ id: '1' })
      const car2 = CarsDataBuilder({ id: '2' })
      sut.items = [car1, car2]

      const result = await sut.findAllById([{ id: '1' }, { id: '2' }])

      expect(result).toEqual([car1, car2])
    })

    it('should return an empty array if no cars with the specified ids are found', async () => {
      const result = await sut.findAllById([{ id: '1' }, { id: '2' }])

      expect(result).toEqual([])
    })
  })

  describe('applyFilter', () => {
    it('should return all items if filter is null', async () => {
      const car1 = CarsDataBuilder({ model: 'ModelX' })
      const car2 = CarsDataBuilder({ model: 'ModelY' })
      const items = [car1, car2]

      const result = await sut['applyFilter'](items, null)

      expect(result).toEqual(items)
    })

    it('should return filtered items based on the model', async () => {
      const car1 = CarsDataBuilder({ model: 'ModelX' })
      const car2 = CarsDataBuilder({ model: 'ModelY' })
      const items = [car1, car2]

      const result = await sut['applyFilter'](items, 'ModelX')

      expect(result).toEqual([car1])
    })
  })

  describe('applySort', () => {
    it('should sort items by created_at when sort param is null', async () => {
      const createdAt = new Date()
      const car1 = CarsDataBuilder({ createdAt: createdAt })
      const car2 = CarsDataBuilder({
        createdAt: new Date(createdAt.getTime() + 100),
      })
      const car3 = CarsDataBuilder({
        createdAt: new Date(createdAt.getTime() + 200),
      })
      const items = [car1, car2, car3]

      sut.items.push(...items)
      const result = await sut['applySort'](sut.items, null, null)

      expect(result).toStrictEqual([car1, car2, car3])
    })

    it('should sort items by specified field and direction', async () => {
      const car1 = CarsDataBuilder({ year: '2020' })
      const car2 = CarsDataBuilder({ year: '2021' })
      const items = [car1, car2]

      const result = await sut['applySort'](items, 'year', 'asc')

      expect(result).toEqual([car1, car2])
    })
  })
})
