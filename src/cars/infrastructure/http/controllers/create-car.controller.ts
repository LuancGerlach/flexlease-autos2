import { AppError } from '@/common/domain/errors/app-error'
import { z } from 'zod'
import { CarsTypeormRepository } from '../../typeorm/repositories/cars-typeorm.repository'
import { dataSource } from '@/common/infrastructure/typeorm'
import { CreateCarUseCase } from '@/cars/application/usecases/create-car.usecase'
import { Car } from '../../typeorm/entities/cars.entity'
import { Request, Response } from 'express'

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

  const validatedData = createCarBodySchema.safeParse(request.body)

  if (validatedData.success === false) {
    console.error('Invalid data ', validatedData.error.format())
    throw new AppError(
      `${validatedData.error.errors.map(err => {
        return `${err.path} -> ${err.message}`
      })}`,
    )
  }

  const { model, year, valuePerDay, numberOfPassengers, accessories } =
    validatedData.data

  const repository = new CarsTypeormRepository()
  repository.carsRepository = dataSource.getRepository(Car)
  const createCarUseCase = new CreateCarUseCase.UseCase(repository)

  const car = await createCarUseCase.execute({
    model,
    year,
    valuePerDay,
    numberOfPassengers,
    accessories,
  })

  return response.status(201).json(car)
}
