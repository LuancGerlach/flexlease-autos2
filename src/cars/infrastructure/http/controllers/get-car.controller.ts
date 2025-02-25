import 'reflect-metadata'
import { z } from 'zod'
import { GetCarUseCase } from '@/cars/application/usecases/get-car.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'

export async function getCarController(request: Request, response: Response) {
  const getCarBodySchema = z.object({
    id: z.string(),
  })
  const { id } = dataValidation(getCarBodySchema, request.params)

  const getCarUseCase: GetCarUseCase.UseCase =
    container.resolve('GetCarUseCase')

  const car = await getCarUseCase.execute({ id })

  return response.status(201).json(car)
}
