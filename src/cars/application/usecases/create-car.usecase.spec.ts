import { CarsRepository } from '@/cars/domain/repositories/cars.repository'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { CreateCarUseCase } from './create-car.usecase'
import { CarsInMemoryRepository } from '@/cars/infrastructure/in-memory/repositories/cars-in-memory.repository'

describe('CreateCarUseCase', () => {
  let repository: CarsRepository
  let sut: CreateCarUseCase.UseCase

  beforeEach(() => {
    repository = new CarsInMemoryRepository()
    sut = new CreateCarUseCase.UseCase(repository)
  })

  const validInput: CreateCarUseCase.Input = {
    model: 'Test Model',
    year: '2020',
    valuePerDay: 100,
    numberOfPassengers: 4,
    accessories: [
      { id: '1', description: 'Air Conditioning' },
      { id: '2', description: 'GPS' },
    ],
  }

  it('should create a car successfully', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const result = await sut.execute(validInput)
    expect(result.id).toBeDefined()
    expect(result.created_at).toBeDefined()
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('should throw BadRequestError if valuePerDay is negative', async () => {
    const invalidInput = { ...validInput, valuePerDay: -1 }

    await expect(sut.execute(invalidInput)).rejects.toThrow(BadRequestError)
  })

  it('should throw BadRequestError if numberOfPassengers is negative', async () => {
    const invalidInput = { ...validInput, numberOfPassengers: -1 }

    await expect(sut.execute(invalidInput)).rejects.toThrow(BadRequestError)
  })

  it('should throw BadRequestError if accessories are not provided', async () => {
    const invalidInput = { ...validInput, accessories: [] }

    await expect(sut.execute(invalidInput)).rejects.toThrow(BadRequestError)
  })

  it('should throw BadRequestError if car year is out of range', async () => {
    const invalidInput = { ...validInput, year: '1949' }

    await expect(sut.execute(invalidInput)).rejects.toThrow(BadRequestError)
  })

  it('should throw BadRequestError if accessories are not unique', async () => {
    const invalidInput = {
      ...validInput,
      accessories: [
        { id: '1', description: 'Air Conditioning' },
        { id: '2', description: 'Air Conditioning' },
      ],
    }

    await expect(sut.execute(invalidInput)).rejects.toThrow(BadRequestError)
  })
})
