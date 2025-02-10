import { CreateCarUseCase } from '@/cars/application/usecases/create-car.usecase'
import { CarsTypeormRepository } from '@/cars/infrastructure/typeorm/repositories/cars-typeorm.repository'
import { container } from 'tsyringe'

container.registerSingleton('CarRepository', CarsTypeormRepository)
container.registerSingleton('CreateCarUseCase', CreateCarUseCase.UseCase)
