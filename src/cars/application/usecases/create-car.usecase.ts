import { CarsRepository } from '@/cars/domain/repositories/cars.repository'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'

export namespace CreateCarUseCase {
  export type Input = {
    model: string
    year: string
    valuePerDay: number
    numberOfPassengers: number
    accessories: TypeAccessories[]
  }

  export type TypeAccessories = {
    id: string
    description: string
  }

  export type Output = {
    id: string
    model: string
    year: string
    valuePerDay: number
    numberOfPassengers: number
    accessories: TypeAccessories[]
    created_at: Date
    updated_at: Date
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

      const accessoryDescriptions = input.accessories.map(
        accessory => accessory.description,
      )
      if (
        new Set(accessoryDescriptions).size !== accessoryDescriptions.length
      ) {
        throw new BadRequestError('Accessory must be unique')
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
