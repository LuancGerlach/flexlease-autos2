import { CarsRepository } from '@/cars/domain/repositories/cars.repository'
import { CarsInMemoryRepository } from '@/cars/infrastructure/in-memory/repositories/cars-in-memory.repository'
import { SearchCarUseCase } from './search-car.usecase'
import { PaginationOutputMapper } from '../dtos/pagination-output.dto'

describe('SearchCarUseCase', () => {
  let repository: CarsRepository
  let sut: SearchCarUseCase.UseCase

  beforeEach(() => {
    repository = new CarsInMemoryRepository()
    sut = new SearchCarUseCase.UseCase(repository)
  })

  it('should return paginated car results', async () => {
    const cars = [
      {
        id: '1',
        model: 'Toyota Corolla',
        year: '2020',
        valuePerDay: 100,
        numberOfPassengers: 4,
        accessories: [{ id: '1', description: 'Air Conditioning' }],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '2',
        model: 'Honda Civic',
        year: '2019',
        valuePerDay: 90,
        numberOfPassengers: 4,
        accessories: [{ id: '2', description: 'GPS' }],
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]
    cars.forEach(car => repository.insert(car))

    const input: SearchCarUseCase.Input = {
      page: 1,
      per_page: 1,
      sort: 'model',
      sort_dir: 'asc',
      filter: null,
    }
    const output = await sut.execute(input)

    expect(output).toEqual(
      PaginationOutputMapper.toOutput([cars[0]], {
        total: 2,
        current_page: 1,
        per_page: 1,
      }),
    )
  })

  it('should return an empty list if no cars match the filter', async () => {
    const input: SearchCarUseCase.Input = {
      page: 1,
      per_page: 1,
      sort: 'model',
      sort_dir: 'asc',
      filter: 'NonExistentModel',
    }
    const output = await sut.execute(input)

    expect(output).toEqual(
      PaginationOutputMapper.toOutput([], {
        total: 0,
        current_page: 1,
        per_page: 1,
      }),
    )
  })

  it('should return cars sorted in descending order', async () => {
    const cars = [
      {
        id: '1',
        model: 'Toyota Corolla',
        year: '2020',
        valuePerDay: 100,
        numberOfPassengers: 4,
        accessories: [{ id: '1', description: 'Air Conditioning' }],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '2',
        model: 'Honda Civic',
        year: '2019',
        valuePerDay: 90,
        numberOfPassengers: 4,
        accessories: [{ id: '2', description: 'GPS' }],
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]
    cars.forEach(car => repository.insert(car))

    const input: SearchCarUseCase.Input = {
      page: 1,
      per_page: 2,
      sort: 'model',
      sort_dir: 'desc',
      filter: null,
    }
    const output = await sut.execute(input)

    expect(output.items[0].model).toBe('Toyota Corolla')
    expect(output.items[1].model).toBe('Honda Civic')
  })

  it('should return cars with pagination correctly', async () => {
    const cars = [
      {
        id: '1',
        model: 'Toyota Corolla',
        year: '2020',
        valuePerDay: 100,
        numberOfPassengers: 4,
        accessories: [{ id: '1', description: 'Air Conditioning' }],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '2',
        model: 'Honda Civic',
        year: '2019',
        valuePerDay: 90,
        numberOfPassengers: 4,
        accessories: [{ id: '2', description: 'GPS' }],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '3',
        model: 'Ford Focus',
        year: '2018',
        valuePerDay: 80,
        numberOfPassengers: 5,
        accessories: [{ id: '3', description: 'Sunroof' }],
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]
    cars.forEach(car => repository.insert(car))

    const input: SearchCarUseCase.Input = {
      page: 2,
      per_page: 1,
      sort: 'model',
      sort_dir: 'asc',
      filter: null,
    }
    const output = await sut.execute(input)

    expect(output.items.length).toBe(1)
    expect(output.current_page).toBe(2)
  })

  it('should return all cars if pagination parameters are not provided', async () => {
    const cars = [
      {
        id: '1',
        model: 'Toyota Corolla',
        year: '2020',
        valuePerDay: 100,
        numberOfPassengers: 4,
        accessories: [{ id: '1', description: 'Air Conditioning' }],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '2',
        model: 'Honda Civic',
        year: '2019',
        valuePerDay: 90,
        numberOfPassengers: 4,
        accessories: [{ id: '2', description: 'GPS' }],
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]
    cars.forEach(car => repository.insert(car))

    const input: SearchCarUseCase.Input = {
      sort: null,
      sort_dir: null,
      filter: null,
    }
    const output = await sut.execute(input)

    expect(output.items.length).toBe(2)
    expect(output.total).toBe(2)
  })

  it('should perform case-insensitive search', async () => {
    const cars = [
      {
        id: '1',
        model: 'Toyota Corolla',
        year: '2020',
        valuePerDay: 100,
        numberOfPassengers: 4,
        accessories: [{ id: '1', description: 'Air Conditioning' }],
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '2',
        model: 'Honda Civic',
        year: '2019',
        valuePerDay: 90,
        numberOfPassengers: 4,
        accessories: [{ id: '2', description: 'GPS' }],
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]
    cars.forEach(car => repository.insert(car))

    const input: SearchCarUseCase.Input = {
      page: 1,
      per_page: 10,
      sort: null,
      sort_dir: null,
      filter: 'toyota corolla',
    }
    const output = await sut.execute(input)

    expect(output.items.length).toBe(1)
    expect(output.items[0].model).toBe('Toyota Corolla')
  })
})
