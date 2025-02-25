import 'reflect-metadata'
import { CarsRepository } from '@/cars/domain/repositories/cars.repository'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { randomUUID } from 'node:crypto'
import { inject, injectable } from 'tsyringe'
import { CarOutput } from '../dtos/car-output.dto'

export namespace UpdateCarUseCase {
  export type Input = {
    id: string
    model?: string
    year?: string
    valuePerDay?: number
    numberOfPassengers?: number
    accessories?: TypeAccessoriesInput[]
  }

  export type TypeAccessoriesInput = {
    id?: string
    description?: string
  }

  export type Output = CarOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('CarRepository')
      private carsRepository: CarsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const car: CarOutput = await this.carsRepository.findById(input.id)

      if (input.valuePerDay !== undefined && input.valuePerDay < 0) {
        throw new BadRequestError('Value per day must be non-negative')
      }

      if (
        input.numberOfPassengers !== undefined &&
        input.numberOfPassengers < 0
      ) {
        throw new BadRequestError('Number of passengers must be non-negative')
      }

      if (
        input.year !== undefined &&
        (parseInt(input.year) < 1950 || parseInt(input.year) > 2025)
      ) {
        throw new BadRequestError('Car year must be between 1950 and 2025')
      }

      if (input.accessories) {
        const uniqueDescriptions = new Set<string>()
        for (const accessory of input.accessories) {
          if (uniqueDescriptions.has(accessory.description)) {
            throw new BadRequestError('Accessory descriptions must be unique')
          }
          uniqueDescriptions.add(accessory.description)
          accessory.id = accessory.id ?? randomUUID()
        }
      }

      Object.assign(car, input)

      const updatedCar: CarOutput = await this.carsRepository.update(car)

      return updatedCar
    }
  }
}
