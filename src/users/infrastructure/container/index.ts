import { container } from 'tsyringe'
import { dataSource } from '@/common/infrastructure/typeorm'
import { User } from '../typeorm/entities/users.entity'
import { UsersTypeormRepository } from '../typeorm/repositories/users-typeorm.repository'
import { CreateUserUseCase } from '@/users/application/usecases/create-user.usecase'
import { GetUserAddressUseCase } from '@/users/application/usecases/get-user-address.usecase'

container.registerSingleton('UsersRepository', UsersTypeormRepository)
container.registerInstance(
  'UsersDefaultRepositoryTypeorm',
  dataSource.getRepository(User),
)

container.registerSingleton('CreateUserUseCase', CreateUserUseCase.UseCase)
container.registerSingleton(
  'GetUserAddressUseCase',
  GetUserAddressUseCase.UseCase,
)
