export type CarOutput = {
  id: string
  model: string
  year: string
  valuePerDay: number
  numberOfPassengers: number
  accessories: CarTypeAccessoriesOutput[]
  created_at: Date
  updated_at: Date
}

export type CarTypeAccessoriesOutput = {
  id: string
  description: string
}
