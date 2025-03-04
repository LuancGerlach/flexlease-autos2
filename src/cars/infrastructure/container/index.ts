import { CreateCarUseCase } from '@/cars/application/usecases/create-car.usecase'
import { GetCarUseCase } from '@/cars/application/usecases/get-car.usecase'
import { CarsTypeormRepository } from '@/cars/infrastructure/typeorm/repositories/cars-typeorm.repository'
import { Car } from '@/cars/infrastructure/typeorm/entities/cars.entity'
import { container } from 'tsyringe'
import { dataSource } from '@/common/infrastructure/typeorm'
import { UpdateCarUseCase } from '@/cars/application/usecases/update-car.usecase'
import { DeleteCarUseCase } from '@/cars/application/usecases/delete-car.usecase'
import { SearchCarUseCase } from '@/cars/application/usecases/search-car.usecase'

container.registerSingleton('CarRepository', CarsTypeormRepository)
container.registerSingleton('CreateCarUseCase', CreateCarUseCase.UseCase)
container.registerInstance(
  'CarsDefaultTypeormRepository',
  dataSource.getRepository(Car),
)
container.registerSingleton('GetCarUseCase', GetCarUseCase.UseCase)
container.registerSingleton('UpdateCarUseCase', UpdateCarUseCase.UseCase)
container.registerSingleton('DeleteCarUseCase', DeleteCarUseCase.UseCase)
container.registerSingleton('SearchCarUseCase', SearchCarUseCase.UseCase)
