import axios from 'axios'
import { NotFoundError } from '@/common/domain/errors/not-found-error'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'

export namespace GetUserAddressUseCase {
  export type Input = {
    cep: string
  }

  export type Output = {
    patio: string
    complement: string
    neighborhood: string
    locality: string
    uf: string
  }

  export class UseCase {
    async execute(input: Input): Promise<Output> {
      if (!/^\d{5}-?\d{3}$/.test(input.cep)) {
        throw new BadRequestError('Invalid CEP format.')
      }

      try {
        const { data } = await axios.get(
          `https://viacep.com.br/ws/${input.cep}/json`,
        )

        if (!data || data.erro) {
          throw new NotFoundError('Address not found for the provided CEP.')
        }

        return {
          patio: data.logradouro ?? 'N/A',
          complement: data.complemento ?? 'N/A',
          neighborhood: data.bairro ?? 'N/A',
          locality: data.localidade ?? 'N/A',
          uf: data.uf ?? 'N/A',
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new BadRequestError('Invalid request to the CEP API.')
        }
        if (error instanceof NotFoundError) {
          throw error
        }
        throw new BadRequestError('Unexpected error occurred.')
      }
    }
  }
}
