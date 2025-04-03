import { RepositoryInterface } from '@/common/domain/repositories/repository.interface'
import { UserModel } from '../models/users.model'

export type CreateUserProps = {
  id?: string
  name: string
  cpf: string
  birth: string
  email: string
  password: string
  cep: string
  qualified: string
  patio: string
  complement: string
  neighborhood: string
  locality: string
  uf: string
}

export interface UsersRepository
  extends RepositoryInterface<UserModel, CreateUserProps> {
  findByEmail(email: string): Promise<UserModel>
  findByName(name: string): Promise<UserModel>
  conflictingEmail(email: string): Promise<void>
  conflictingCpf(cpf: string): Promise<void>
}
