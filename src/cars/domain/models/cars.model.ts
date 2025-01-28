export interface CarModel {
  id: string
  model: string
  year: string
  valuePerDay: number
  numberOfPassengers: number
  accessories: TypeAccessories[]
  createdAt?: Date
  updatedAt?: Date
}

export type TypeAccessories = {
  id: string
  description: string
}
