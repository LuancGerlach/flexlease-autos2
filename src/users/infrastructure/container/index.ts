import { container } from 'tsyringe'
import { dataSource } from '@/common/infrastructure/typeorm'
import { User } from '../typeorm/entities/users.entity'
import { UsersTypeormRepository } from '../typeorm/repositories/users-typeorm.repository'

container.registerSingleton('UserRepository', UsersTypeormRepository)
container.registerInstance(
  'CarsDefaultTypeormRepository',
  dataSource.getRepository(User),
)
