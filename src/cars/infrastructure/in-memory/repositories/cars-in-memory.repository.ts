import { CarModel } from '@/cars/domain/models/cars.model'
import {
  CarId,
  CarsRepository,
} from '@/cars/domain/repositories/cars.repository'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { InMemoryRepository } from '@/common/domain/repositories/in-memory.repository'

export class CarsInMemoryRepository
  extends InMemoryRepository<CarModel>
  implements CarsRepository
{
  sorteableFields = ['model', 'year', 'created_at']

  async findAllByModel(model: string): Promise<CarModel[]> {
    const cars = this.items.filter(item => item.model === model)
    if (cars.length === 0) {
      throw new NotFoundError(`No cars found with model ${model}`)
    }
    return cars
  }

  async findAllById(carIds: CarId[]): Promise<CarModel[]> {
    const existingCars = []
    for (const carId of carIds) {
      const car = this.items.find(item => item.id === carId.id)
      if (car) {
        existingCars.push(car)
      }
    }
    return existingCars
  }

  protected async applyFilter(
    items: CarModel[],
    filter: string | null,
  ): Promise<CarModel[]> {
    if (!filter) return items
    return items.filter(item =>
      item.model.toLocaleLowerCase().includes(filter.toLocaleLowerCase()),
    )
  }

  protected async applySort(
    items: CarModel[],
    sort: string | null,
    sort_dir: string | null,
  ): Promise<CarModel[]> {
    return super.applySort(items, sort || 'created_at', sort_dir || 'desc')
  }
}
