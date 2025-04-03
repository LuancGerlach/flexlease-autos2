import axios from 'axios'
import { GetUserAddressUseCase } from './get-user-address.usecase'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'

jest.mock('axios')

describe('GetUserAddressUseCase', () => {
  let sut: GetUserAddressUseCase.UseCase

  beforeEach(() => {
    sut = new GetUserAddressUseCase.UseCase()
  })

  const validInput: GetUserAddressUseCase.Input = {
    cep: '01001-000',
  }

  it('should return address successfully', async () => {
    const mockResponse = {
      logradouro: 'Praça da Sé',
      complemento: 'lado ímpar',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP',
    }
    ;(axios.get as jest.Mock).mockResolvedValue({ data: mockResponse })

    const result = await sut.execute(validInput)
    expect(result).toEqual({
      patio: 'Praça da Sé',
      complement: 'lado ímpar',
      neighborhood: 'Sé',
      locality: 'São Paulo',
      uf: 'SP',
    })
  })

  it('should throw BadRequestError if CEP format is invalid', async () => {
    const invalidInput = { cep: '1234' }
    await expect(sut.execute(invalidInput)).rejects.toThrow(BadRequestError)
  })

  it('should throw NotFoundError if address is not found', async () => {
    ;(axios.get as jest.Mock).mockResolvedValue({ data: { erro: true } })
    await expect(sut.execute(validInput)).rejects.toThrow(NotFoundError)
  })

  it('should throw BadRequestError if API request fails', async () => {
    ;(axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'))
    await expect(sut.execute(validInput)).rejects.toThrow(BadRequestError)
  })
})
