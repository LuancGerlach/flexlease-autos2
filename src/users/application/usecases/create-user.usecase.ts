import { inject, injectable } from 'tsyringe'
import { UserOutput } from '../dtos/user-output.dto'
import { UsersRepository } from '@/users/domain/repositories/users.repository'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { cpf } from 'cpf-cnpj-validator'
import { GetUserAddressUseCase } from './get-user-address.usecase'
import { HashProvider } from '@/common/domain/providers/hash-provider'

export namespace CreateUserUseCase {
  export type Input = {
    name: string
    cpf: string
    birth: string
    email: string
    password: string
    cep: string
    qualified: string
  }

  export type Output = UserOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private usersRepository: UsersRepository,
      @inject('HashProvider')
      private hashProvider: HashProvider,
      @inject('GetUserAddressUseCase')
      private getUserAddressUseCase: GetUserAddressUseCase.UseCase,
    ) {}
    async execute(input: Input): Promise<Output> {
      if (
        !input.name ||
        !input.cpf ||
        !input.birth ||
        !input.email ||
        !input.password ||
        !input.cep ||
        !input.qualified
      ) {
        throw new BadRequestError('Input data not provided or invalid')
      }

      const [day, month, year] = input.birth.split('/').map(Number)
      if (new Date(year + 18, month - 1, day) > new Date()) {
        throw new BadRequestError('User must be at least 18 years old')
      }

      if (input.qualified !== 'sim' && input.qualified !== 'não') {
        throw new BadRequestError('Invalid "qualified" value')
      }

      if (!cpf.isValid(input.cpf)) {
        throw new BadRequestError('Invalid CPF')
      }
      input.cpf = cpf.format(input.cpf)

      const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
      if (!validEmailRegex.test(input.email)) {
        throw new BadRequestError('Invalid email')
      }

      if (input.password.length < 6) {
        throw new BadRequestError('Password must have at least 6 characters')
      }

      await this.usersRepository.conflictingCpf(input.cpf)
      await this.usersRepository.conflictingEmail(input.email)

      const userAdress = await this.getUserAddressUseCase.execute({
        cep: input.cep,
      })

      const hashedPassword = await this.hashProvider.generateHash(
        input.password,
      )

      const user = this.usersRepository.create({
        ...input,
        ...userAdress,
      })
      user.password = hashedPassword
      return this.usersRepository.insert(user)
    }
  }
}
