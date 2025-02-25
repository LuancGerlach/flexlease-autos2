import 'reflect-metadata'
import { CarsRepository } from '@/cars/domain/repositories/cars.repository'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { randomUUID } from 'node:crypto'
import { inject, injectable } from 'tsyringe'
import { CarOutput } from '../dtos/car-output.dto'

export namespace CreateCarUseCase {
  export type Input = {
    model: string
    year: string
    valuePerDay: number
    numberOfPassengers: number
    accessories: TypeAccessoriesInput[]
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
      if (
        input.valuePerDay < 0 ||
        input.numberOfPassengers < 0 ||
        !input.accessories ||
        input.accessories.length === 0
      ) {
        throw new BadRequestError('Input data not provided or invalid')
      }

      if (parseInt(input.year) < 1950 || parseInt(input.year) > 2025) {
        throw new BadRequestError('Car year must be between 1950 and 2025')
      }

      const uniqueDescriptions = new Set<string>()
      for (const accessory of input.accessories) {
        if (uniqueDescriptions.has(accessory.description)) {
          throw new BadRequestError('Accessory descriptions must be unique')
        }
        uniqueDescriptions.add(accessory.description)
        accessory.id = accessory.id ?? randomUUID()
      }

      const car = this.carsRepository.create(input)
      const createdCar: CarOutput = await this.carsRepository.insert(car)

      return createdCar
    }
  }
}
