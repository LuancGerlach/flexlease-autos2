import { CarModel } from '@/cars/domain/models/cars.model'
import {
  CarId,
  CarsRepository,
  CreateCarProps,
} from '@/cars/domain/repositories/cars.repository'
import {
  SearchInput,
  SearchOutput,
} from '@/common/domain/repositories/repository.interface'
import { Car } from '../entities/cars.entity'
import { Repository } from 'typeorm'
import { dataSource } from '@/common/infrastructure/typeorm'
import { NotFoundError } from '@/common/domain/errors/not-found-error'

export class CarsTypeormRepository implements CarsRepository {
  sorteableFields = ['model', 'year', 'created_at']
  carsRepository: Repository<Car>

  constructor() {
    this.carsRepository = dataSource.getRepository(Car)
  }

  findAllByModel(model: string): Promise<CarModel[]> {
    throw new Error('Method not implemented.')
  }

  findAllById(carIds: CarId[]): Promise<CarModel[]> {
    throw new Error('Method not implemented.')
  }

  create(props: CreateCarProps): CarModel {
    throw new Error('Method not implemented.')
  }

  insert(model: CarModel): Promise<CarModel> {
    throw new Error('Method not implemented.')
  }

  async findById(id: string): Promise<CarModel> {
    return this._get(id)
  }

  update(model: CarModel): Promise<CarModel> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  search(props: SearchInput): Promise<SearchOutput<CarModel>> {
    throw new Error('Method not implemented.')
  }

  protected async _get(id: string): Promise<CarModel> {
    const car = await this.carsRepository.findOneBy({ id })
    if (!car) {
      throw new NotFoundError(`No cars found using id ${id}`)
    }
    return car
  }
}
