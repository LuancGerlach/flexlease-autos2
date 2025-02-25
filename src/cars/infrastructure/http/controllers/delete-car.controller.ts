import 'reflect-metadata'
import { z } from 'zod'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { DeleteCarUseCase } from '@/cars/application/usecases/delete-car.usecase'

export async function deleteCarController(
  request: Request,
  response: Response,
) {
  const deleteCarBodySchema = z.object({
    id: z.string().uuid(),
  })
  const { id } = dataValidation(deleteCarBodySchema, request.params)

  const deleteCarUseCase: DeleteCarUseCase.UseCase =
    container.resolve('DeleteCarUseCase')

  await deleteCarUseCase.execute({ id })

  return response.status(204).send()
}
