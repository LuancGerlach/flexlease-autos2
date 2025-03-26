import { randomUUID } from 'node:crypto'
import { UserModel } from '@/users/domain/models/users.model'
import { faker } from '@faker-js/faker/locale/pt_BR'

export function UsersDataBuilder(props: Partial<UserModel>): UserModel {
  return {
    id: props.id ?? randomUUID(),
    name: props.name ?? faker.person.fullName(),
    cpf: props.cpf ?? '96737438008',
    birth: props.birth ?? faker.date.birthdate().toString(),
    email: props.email ?? faker.internet.email(),
    password: props.password ?? faker.internet.password(),
    cep: props.cep ?? faker.location.zipCode(),
    qualified: props.qualified ?? 'sim',
    patio: props.patio ?? faker.address.streetAddress(),
    complement: props.complement ?? faker.address.secondaryAddress(),
    neighborhood: props.neighborhood ?? faker.address.county(),
    locality: props.locality ?? faker.address.city(),
    uf: props.uf ?? faker.address.state(),
    created_at: props.created_at ?? new Date(),
    updated_at: props.updated_at ?? new Date(),
  }
}
