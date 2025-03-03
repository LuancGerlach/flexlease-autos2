import 'reflect-metadata'
import { CarsRepository } from '@/cars/domain/repositories/cars.repository'
import { inject, injectable } from 'tsyringe'
import { CarOutput } from '../dtos/car-output.dto'

export namespace GetCarUseCase {
  export type Input = {
    id: string
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

      return car
    }
  }
}
