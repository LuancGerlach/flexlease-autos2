import { CarsRepository } from '@/cars/domain/repositories/cars.repository'
import { CarsInMemoryRepository } from '@/cars/infrastructure/in-memory/repositories/cars-in-memory.repository'
import { DeleteCarUseCase } from './delete-car.usecase'

describe('DeleteCarUseCase', () => {
  let repository: CarsRepository
  let sut: DeleteCarUseCase.UseCase

  beforeEach(() => {
    repository = new CarsInMemoryRepository()
    sut = new DeleteCarUseCase.UseCase(repository)
  })

  it('should delete a car for a valid car id', async () => {
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
    repository.insert(car)

    const input: DeleteCarUseCase.Input = { id: '1' }
    await sut.execute(input)

    await expect(sut.execute(input)).rejects.toThrow(
      'Model not found using id 1',
    )
  })

  it('should throw an error if car is not found', async () => {
    const input: DeleteCarUseCase.Input = { id: 'non-existent-id' }

    await expect(sut.execute(input)).rejects.toThrow(
      'Model not found using id non-existent-id',
    )
  })
})
