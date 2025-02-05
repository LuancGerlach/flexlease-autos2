import { CarsRepository } from '@/cars/domain/repositories/cars.repository'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { randomUUID } from 'node:crypto'

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

  export type Output = {
    id: string
    model: string
    year: string
    valuePerDay: number
    numberOfPassengers: number
    accessories: TypeAccessoriesOutput[]
    created_at: Date
    updated_at: Date
  }

  export type TypeAccessoriesOutput = {
    id: string
    description: string
  }

  export class UseCase {
    constructor(private repository: CarsRepository) {}

    async execute(input: Input): Promise<Output> {
      if (
        input.valuePerDay < 0 ||
        input.numberOfPassengers < 0 ||
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

      const car = this.repository.create(input)
      await this.repository.insert(car)

      return {
        id: car.id,
        model: car.model,
        year: car.year,
        valuePerDay: car.valuePerDay,
        numberOfPassengers: car.numberOfPassengers,
        accessories: car.accessories,
        created_at: car.created_at,
        updated_at: car.updated_at,
      }
    }
  }
}
