import { CarsRepository } from '@/cars/domain/repositories/cars.repository'
import { CarsInMemoryRepository } from '@/cars/infrastructure/in-memory/repositories/cars-in-memory.repository'
import { GetCarUseCase } from './get-car.usecase'

describe('GetCarUseCase', () => {
  let repository: CarsRepository
  let sut: GetCarUseCase.UseCase

  beforeEach(() => {
    repository = new CarsInMemoryRepository()
    sut = new GetCarUseCase.UseCase(repository)
  })

  it('should return car details for a valid car id', async () => {
    const car = {
      id: '1',
      model: 'Toyota Corolla',
      year: '2020',
      valuePerDay: 100,
      numberOfPassengers: 4,
      accessories: [{ id: '1', description: 'Air Conditioning' }],
      created_at: new Date(),
      updated_at: new Date(),
    }
    const createdCar = repository.create(car)
    repository.insert(createdCar)

    const input: GetCarUseCase.Input = { id: '1' }
    const output = await sut.execute(input)

    expect(output).toEqual(car)
  })

  it('should throw an error if car is not found', async () => {
    const input: GetCarUseCase.Input = { id: 'non-existent-id' }

    await expect(sut.execute(input)).rejects.toThrow(
      'Model not found using id non-existent-id',
    )
  })
})
