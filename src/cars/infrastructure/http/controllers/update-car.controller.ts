import 'reflect-metadata'
import { z } from 'zod'
import { UpdateCarUseCase } from '@/cars/application/usecases/update-car.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'

export async function updateCarController(
  request: Request,
  response: Response,
) {
  const updateCarBodySchema = z.object({
    model: z.string().optional(),
    year: z.string().optional(),
    valuePerDay: z.number().optional(),
    numberOfPassengers: z.number().optional(),
    accessories: z
      .array(
        z.object({
          description: z.string().nonempty(),
        }),
      )
      .optional(),
  })

  const { model, year, valuePerDay, numberOfPassengers, accessories } =
    dataValidation(updateCarBodySchema, request.body)

  const updateCarParamSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = dataValidation(updateCarParamSchema, request.params)

  const updateCarUseCase: UpdateCarUseCase.UseCase = container.resolve(
    UpdateCarUseCase.UseCase,
  )

  const car = await updateCarUseCase.execute({
    id,
    model,
    year,
    valuePerDay,
    numberOfPassengers,
    accessories,
  })

  return response.status(200).json(car)
}
