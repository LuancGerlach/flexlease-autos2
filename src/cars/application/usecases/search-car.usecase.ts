import 'reflect-metadata'
import { CarsRepository } from '@/cars/domain/repositories/cars.repository'
import { inject, injectable } from 'tsyringe'
import { SearchInputDto } from '../dtos/search-input.dto'
import {
  PaginationOutputDto,
  PaginationOutputMapper,
} from '../dtos/pagination-output.dto'
import { CarModel } from '@/cars/domain/models/cars.model'

export namespace SearchCarUseCase {
  export type Input = SearchInputDto

  export type Output = PaginationOutputDto<CarModel>

  @injectable()
  export class UseCase {
    constructor(
      @inject('CarRepository')
      private carsRepository: CarsRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const searchResult = await this.carsRepository.search(input)
      return PaginationOutputMapper.toOutput(searchResult.items, searchResult)
    }
  }
}
