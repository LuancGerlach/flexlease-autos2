import 'reflect-metadata'
import { CarsRepository } from '@/cars/domain/repositories/cars.repository'
import { inject, injectable } from 'tsyringe'

export namespace DeleteCarUseCase {
  export type Input = {
    id: string
  }

  export type Output = void

  @injectable()
  export class UseCase {
    constructor(
      @inject('CarRepository')
      private carsRepository: CarsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      await this.carsRepository.delete(input.id)
    }
  }
}
