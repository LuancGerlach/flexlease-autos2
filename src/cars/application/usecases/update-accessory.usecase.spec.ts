import 'reflect-metadata'
import { UpdateAccessoryUseCase } from './update-accessory.usecase'
import { CarsRepository } from '@/cars/domain/repositories/cars.repository'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'
import { container } from 'tsyringe'

describe('UpdateAcessoryUseCase', () => {
  let carsRepository: CarsRepository
  let useCase: UpdateAccessoryUseCase.UseCase

  beforeEach(() => {
    carsRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as unknown as CarsRepository

    container.registerInstance('CarRepository', carsRepository)
    useCase = container.resolve(UpdateAccessoryUseCase.UseCase)
  })

  it('should update accessory description if accessory id is found', async () => {
    const car = {
      id: 'car-id',
      accessories: [{ id: 'accessory-id', description: 'old-description' }],
    }

    const input: UpdateAccessoryUseCase.Input = {
      idCar: 'car-id',
      idAccessory: 'accessory-id',
      description: 'new-description',
    }

    ;(carsRepository.findById as jest.Mock).mockResolvedValue(car)
    ;(carsRepository.update as jest.Mock).mockResolvedValue(car)

    const result = await useCase.execute(input)

    expect(result.accessories[0].description).toBe('new-description')
    expect(carsRepository.update).toHaveBeenCalledWith(car)
  })

  it('should throw error if accessory description is not unique', async () => {
    const car = {
      id: 'car-id',
      accessories: [
        { id: 'accessory-id-1', description: 'description-1' },
        { id: 'accessory-id-2', description: 'description-2' },
      ],
    }

    const input: UpdateAccessoryUseCase.Input = {
      idCar: 'car-id',
      idAccessory: 'accessory-id-3',
      description: 'description-2',
    }

    ;(carsRepository.findById as jest.Mock).mockResolvedValue(car)

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestError)
  })

  it('should add new accessory if id and description are not found', async () => {
    const car = {
      id: 'car-id',
      accessories: [{ id: 'accessory-id', description: 'old-description' }],
    }

    const input: UpdateAccessoryUseCase.Input = {
      idCar: 'car-id',
      idAccessory: 'new-accessory-id',
      description: 'new-description',
    }

    ;(carsRepository.findById as jest.Mock).mockResolvedValue(car)
    ;(carsRepository.update as jest.Mock).mockResolvedValue(car)

    const result = await useCase.execute(input)

    expect(result.accessories.length).toBe(2)
    expect(result.accessories[1].id).toBe('new-accessory-id')
    expect(result.accessories[1].description).toBe('new-description')
    expect(carsRepository.update).toHaveBeenCalledWith(car)
  })

  it('should remove accessory if both id and description are found', async () => {
    const car = {
      id: 'car-id',
      accessories: [
        { id: 'accessory-id', description: 'old-description' },
        { id: 'accessory-id-2', description: 'new-description' },
      ],
    }

    const input: UpdateAccessoryUseCase.Input = {
      idCar: 'car-id',
      idAccessory: 'accessory-id',
      description: 'new-description',
    }

    ;(carsRepository.findById as jest.Mock).mockResolvedValue(car)
    ;(carsRepository.update as jest.Mock).mockResolvedValue(car)

    const result = await useCase.execute(input)

    expect(result.accessories.length).toBe(1)
    expect(result.accessories[0].id).toBe('accessory-id-2')
    expect(result.accessories[0].description).toBe('new-description')
    expect(carsRepository.update).toHaveBeenCalledWith(car)
  })
})
