import 'reflect-metadata'
import { z } from 'zod'
import { CreateCarUseCase } from '@/cars/application/usecases/create-car.usecase'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { dataValidation } from '@/common/infrastructure/validation/zod'

export async function createCarController(
  request: Request,
  response: Response,
) {
  const createCarBodySchema = z.object({
    model: z.string(),
    year: z.string(),
    valuePerDay: z.number(),
    numberOfPassengers: z.number(),
    accessories: z.array(
      z.object({
        description: z.string().nonempty(),
      }),
    ),
  })

  const { model, year, valuePerDay, numberOfPassengers, accessories } =
    dataValidation(createCarBodySchema, request.body)

  const createCarUseCase: CreateCarUseCase.UseCase =
    container.resolve('CreateCarUseCase')

  const car: CreateCarUseCase.Input = await createCarUseCase.execute({
    model,
    year,
    valuePerDay,
    numberOfPassengers,
    accessories,
  })

  return response.status(201).json(car)
}
