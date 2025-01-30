import { faker } from '@faker-js/faker'
import { CarModel, TypeAccessories } from '@/cars/domain/models/cars.model'
import { randomUUID } from 'node:crypto'

export function CarsDataBuilder(props: Partial<CarModel> = {}): CarModel {
  const accessoriesAirbag: TypeAccessories = {
    id: randomUUID().toString(),
    description: 'airbag',
  }

  return {
    id: props.id || randomUUID(),
    model: props.model || faker.vehicle.model(),
    year: props.year || faker.date.past().getFullYear().toString(),
    valuePerDay: props.valuePerDay || parseFloat(faker.finance.amount()),
    numberOfPassengers: props.numberOfPassengers || 5,
    accessories: props.accessories || [accessoriesAirbag],
    created_at: props.created_at || new Date(),
    updated_at: props.updated_at || new Date(),
  }
}
