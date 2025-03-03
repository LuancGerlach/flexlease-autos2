import { CarsRepository } from '@/cars/domain/repositories/cars.repository'
import { CarsInMemoryRepository } from '@/cars/infrastructure/in-memory/repositories/cars-in-memory.repository'
import { UpdateCarUseCase } from './update-car.usecase'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { CarModel } from '@/cars/domain/models/cars.model'

describe('UpdateCarUseCase', () => {
  let repository: CarsRepository
  let sut: UpdateCarUseCase.UseCase

  beforeEach(() => {
    repository = new CarsInMemoryRepository()
    sut = new UpdateCarUseCase.UseCase(repository)
    repository.insert(validCar)
  })

  const validCar: CarModel = {
    id: '1',
    model: 'Model S',
    year: '2020',
    valuePerDay: 100,
    numberOfPassengers: 4,
    accessories: [{ id: '1', description: 'GPS' }],
    created_at: new Date(),
    updated_at: new Date(),
  }

  const validInput: UpdateCarUseCase.Input = {
    id: '1',
    model: 'Model S',
    year: '2020',
    valuePerDay: 100,
    numberOfPassengers: 4,
    accessories: [{ id: '1', description: 'GPS' }],
  }

  it('should update a car successfully', async () => {
    const spyInsert = jest.spyOn(repository, 'update')
    const result = await sut.execute(validInput)
    expect(result.id).toEqual(validInput.id)
    expect(result.model).toEqual(validInput.model)

    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('should throw BadRequestError if valuePerDay is negative', async () => {
    const invalidInput = { ...validInput, valuePerDay: -100 }
    jest.spyOn(repository, 'findById').mockResolvedValue(validCar)

    await expect(sut.execute(invalidInput)).rejects.toThrow(BadRequestError)
  })

  it('should throw BadRequestError if numberOfPassengers is negative', async () => {
    const invalidInput = { ...validInput, numberOfPassengers: -4 }
    jest.spyOn(repository, 'findById').mockResolvedValue(validCar)

    await expect(sut.execute(invalidInput)).rejects.toThrow(BadRequestError)
  })

  it('should throw BadRequestError if car year is out of range', async () => {
    const invalidInput = { ...validInput, year: '1940' }
    jest.spyOn(repository, 'findById').mockResolvedValue(validCar)

    await expect(sut.execute(invalidInput)).rejects.toThrow(BadRequestError)
  })

  it('should throw BadRequestError if accessory descriptions are not unique', async () => {
    const invalidInput = {
      ...validInput,
      accessories: [
        { id: '1', description: 'GPS' },
        { id: '2', description: 'GPS' },
      ],
    }
    jest.spyOn(repository, 'findById').mockResolvedValue(validCar)

    await expect(sut.execute(invalidInput)).rejects.toThrow(BadRequestError)
  })
})
