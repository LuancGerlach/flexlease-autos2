import { dataValidation } from '@/common/infrastructure/validation/zod'
import { CreateUserUseCase } from '@/users/application/usecases/create-user.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

export async function createUserController(
  request: Request,
  response: Response,
): Promise<Response> {
  const bodySchema = z.object({
    name: z.string(),
    cpf: z.string(),
    birth: z.string(),
    email: z.string().email(),
    password: z.string(),
    cep: z.string(),
    qualified: z.enum(['sim', 'não']),
  })

  const { name, cpf, birth, email, password, cep, qualified } = dataValidation(
    bodySchema,
    request.body,
  )

  const createUserUseCase: CreateUserUseCase.UseCase =
    container.resolve('CreateUserUseCase')

  const user = await createUserUseCase.execute({
    name,
    cpf,
    birth,
    email,
    password,
    cep,
    qualified,
  })

  return response.status(201).json(user)
}
