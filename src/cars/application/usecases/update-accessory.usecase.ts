import 'reflect-metadata'
import { CarsRepository } from '@/cars/domain/repositories/cars.repository'
import { inject, injectable } from 'tsyringe'
import { CarOutput } from '../dtos/car-output.dto'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'

export namespace UpdateAccessoryUseCase {
  export type Input = {
    idCar: string
    idAccessory: string
    description: string
  }

  export type Output = CarOutput

  @injectable()
  export class UseCase {
    constructor(
      @inject('CarRepository')
      private carsRepository: CarsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const car: CarOutput = await this.carsRepository.findById(input.idCar)

      const findAcessoryById = car.accessories.find(
        acc => acc.id === input.idAccessory,
      )

      const findAcessoryByDescription = car.accessories.find(
        acc => acc.description === input.description,
      )

      if (findAcessoryById && findAcessoryByDescription) {
        car.accessories = car.accessories.filter(
          acc => acc.id !== findAcessoryById.id,
        )
      } else if (findAcessoryById) {
        car.accessories.forEach((acc, index) => {
          if (acc.id === findAcessoryById.id) {
            car.accessories[index].description = input.description
          }
        })
      } else if (findAcessoryByDescription) {
        throw new BadRequestError('Accessory descriptions must be unique')
      } else {
        car.accessories.push({
          id: input.idAccessory,
          description: input.description,
        })
      }

      const updatedCar: CarOutput = await this.carsRepository.update(car)
      return updatedCar
    }
  }
}
