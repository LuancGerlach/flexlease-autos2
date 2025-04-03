import 'reflect-metadata'
import { CreateUserUseCase } from '@/users/application/usecases/create-user.usecase'
import { UsersInMemoryRepository } from '@/users/infrastructure/in-memory/repositories/users-in-memory.repository'
import { BcryptjsHashProvider } from '@/common/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { GetUserAddressUseCase } from '@/users/application/usecases/get-user-address.usecase'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import axios from 'axios'
import { cpf } from 'cpf-cnpj-validator'
import { ConflictError } from '@/common/domain/errors/conflict-error'

jest.mock('axios')

describe('CreateUserUseCase Integration Tests', () => {
  let createUserUseCase: CreateUserUseCase.UseCase
  let repository: UsersInMemoryRepository
  let hashProvider: BcryptjsHashProvider
  let getUserAddressUseCase: GetUserAddressUseCase.UseCase

  beforeEach(() => {
    repository = new UsersInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    getUserAddressUseCase = new GetUserAddressUseCase.UseCase()
    createUserUseCase = new CreateUserUseCase.UseCase(
      repository,
      hashProvider,
      getUserAddressUseCase,
    )
  })

  const validInput: CreateUserUseCase.Input = {
    name: 'Test User',
    cpf: cpf.generate(),
    birth: '01/01/2000',
    email: 'test@example.com',
    password: 'secure123',
    cep: '01001-000',
    qualified: 'sim',
  }

  beforeEach(() => {
    ;(axios.get as jest.Mock).mockResolvedValue({
      data: {
        logradouro: 'Rua Teste',
        complemento: '',
        bairro: 'Bairro Teste',
        localidade: 'Cidade Teste',
        uf: 'SP',
      },
    })
  })

  it('should create a user', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const result = await createUserUseCase.execute(validInput)

    expect(result.id).toBeDefined()
    expect(result.created_at).toBeInstanceOf(Date)
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it("should encrypt the user's password when registering", async () => {
    console.log('Before hashing password:', validInput.password)

    const result = await createUserUseCase.execute(validInput)

    console.log('Stored hashed password:', result.password)

    const isPasswordCorrectlyHashed = await hashProvider.compareHash(
      'secure123',
      result.password,
    )

    console.log('Comparing password:', 'secure123')
    console.log('With stored password:', result.password)
    console.log('isPasswordCorrectlyHashed:', isPasswordCorrectlyHashed)

    expect(result.password).not.toBe('secure123')
    expect(isPasswordCorrectlyHashed).toBeTruthy()
  })

  it('should hash and compare password correctly', async () => {
    const password = 'secure123'
    const hashedPassword = await hashProvider.generateHash(password)
    const isValid = await hashProvider.compareHash(password, hashedPassword)

    expect(isValid).toBeTruthy()
  })

  it('should not be able to register with the same email twice', async () => {
    await createUserUseCase.execute(validInput)
    await expect(() =>
      createUserUseCase.execute(validInput),
    ).rejects.toBeInstanceOf(ConflictError)
  })

  it('should throw error when name is not provided', async () => {
    const invalidInput = { ...validInput, name: null }
    await expect(() =>
      createUserUseCase.execute(invalidInput),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throw error when email is not provided', async () => {
    const invalidInput = { ...validInput, email: null }
    await expect(() =>
      createUserUseCase.execute(invalidInput),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throw error when password is not provided', async () => {
    const invalidInput = { ...validInput, password: null }
    await expect(() =>
      createUserUseCase.execute(invalidInput),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throw error when cpf is invalid', async () => {
    const invalidInput = { ...validInput, cpf: '123.456.789-00' }
    await expect(() =>
      createUserUseCase.execute(invalidInput),
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throw error when cep is invalid', async () => {
    ;(axios.get as jest.Mock).mockRejectedValue(
      new NotFoundError('CEP not found'),
    )
    const invalidInput = { ...validInput, cep: '00000-000' }
    await expect(() =>
      createUserUseCase.execute(invalidInput),
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})
