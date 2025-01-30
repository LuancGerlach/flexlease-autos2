export interface CarModel {
  id: string
  model: string
  year: string
  valuePerDay: number
  numberOfPassengers: number
  accessories: TypeAccessories[]
  created_at: Date
  updated_at: Date
}

export type TypeAccessories = {
  id: string
  description: string
}
