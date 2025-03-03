import { RepositoryInterface } from '@/common/domain/repositories/repository.interface'
import { CarModel } from '../models/cars.model'

export type CarId = {
  id: string
}

export type CreateCarProps = {
  id?: string
  model: string
  year: string
  valuePerDay: number
  numberOfPassengers: number
  accessories: { id?: string; description?: string }[]
  created_at?: Date
  updated_at?: Date
}

export interface CarsRepository
  extends RepositoryInterface<CarModel, CreateCarProps> {
  findAllByModel(model: string): Promise<CarModel[]>
  findAllById(carIds: CarId[]): Promise<CarModel[]>
}
