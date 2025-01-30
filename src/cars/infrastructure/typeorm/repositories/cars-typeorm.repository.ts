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
import { Repository, In, ILike } from 'typeorm'
import { dataSource } from '@/common/infrastructure/typeorm'
import { NotFoundError } from '@/common/domain/errors/not-found-error'

export class CarsTypeormRepository implements CarsRepository {
  sortableFields = ['model', 'year', 'created_at']
  carsRepository: Repository<Car>

  constructor() {
    this.carsRepository = dataSource.getRepository(Car)
  }

  async findAllByModel(model: string): Promise<CarModel[]> {
    const carsFound = await this.carsRepository.find({ where: { model } })
    if (!carsFound) {
      throw new NotFoundError(`No cars found using model ${model}`)
    }
    return carsFound
  }

  async findAllById(carIds: CarId[]): Promise<CarModel[]> {
    const ids = carIds.map(carId => carId.id)
    const carsFound = await this.carsRepository.find({
      where: { id: In(ids) },
    })
    return carsFound
  }

  create(props: CreateCarProps): CarModel {
    return this.carsRepository.create(props)
  }

  insert(model: CarModel): Promise<CarModel> {
    return this.carsRepository.save(model)
  }

  async findById(id: string): Promise<CarModel> {
    return this._get(id)
  }

  async update(model: CarModel): Promise<CarModel> {
    await this._get(model.id)
    await this.carsRepository.update({ id: model.id }, model)
    return model
  }

  async delete(id: string): Promise<void> {
    await this._get(id)
    await this.carsRepository.delete({ id })
  }

  async search(props: SearchInput): Promise<SearchOutput<CarModel>> {
    const validSort = this.sortableFields.includes(props.sort) || false
    const dirOps = ['asc', 'desc']
    const validSortDir =
      (props.sort_dir && dirOps.includes(props.sort_dir.toLowerCase())) || false
    const orderByField = validSort ? props.sort : 'created_at'
    const orderByDir = validSortDir ? props.sort_dir : 'desc'

    const [cars, total] = await this.carsRepository.findAndCount({
      ...(props.filter && { where: { model: ILike(props.filter) } }),
      order: { [orderByField]: orderByDir },
      skip: (props.page - 1) * props.per_page,
      take: props.per_page,
    })

    return {
      items: cars,
      per_page: props.per_page,
      total,
      current_page: props.page,
      sort: orderByField,
      sort_dir: orderByDir,
      filter: props.filter,
    }
  }

  protected async _get(id: string): Promise<CarModel> {
    const car = await this.carsRepository.findOneBy({ id })
    if (!car) {
      throw new NotFoundError(`No cars found using id ${id}`)
    }
    return car
  }
}
