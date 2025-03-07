import 'reflect-metadata'
import { z } from 'zod'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'
import { UpdateAccessoryUseCase } from '@/cars/application/usecases/update-accessory.usecase'

export async function updateAccessoryController(
  request: Request,
  response: Response,
) {
  const updateAcessoryBodySchema = z.object({
    description: z.string().nonempty(),
  })

  const { description } = dataValidation(updateAcessoryBodySchema, request.body)

  const updateAcessoryParamSchema = z.object({
    idCar: z.string().uuid(),
    idAccessory: z.string().uuid(),
  })

  const { idCar, idAccessory } = dataValidation(
    updateAcessoryParamSchema,
    request.params,
  )

  const updateAccessoryUseCase: UpdateAccessoryUseCase.UseCase =
    container.resolve(UpdateAccessoryUseCase.UseCase)

  const apdateAcessory = await updateAccessoryUseCase.execute({
    idCar,
    idAccessory,
    description,
  })

  return response.status(200).json(apdateAcessory)
}
