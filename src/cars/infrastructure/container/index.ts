import { CreateCarUseCase } from '@/cars/application/usecases/create-car.usecase'
import { CarsTypeormRepository } from '@/cars/infrastructure/typeorm/repositories/cars-typeorm.repository'
import { Car } from '@/cars/infrastructure/typeorm/entities/cars.entity'
import { container } from 'tsyringe'
import { dataSource } from '@/common/infrastructure/typeorm'

container.registerSingleton('CarRepository', CarsTypeormRepository)
container.registerSingleton('CreateCarUseCase', CreateCarUseCase.UseCase)
container.registerInstance(
  'CarsDefaultTypeormRepository',
  dataSource.getRepository(Car),
)
