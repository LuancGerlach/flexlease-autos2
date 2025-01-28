import { CarModel } from '@/cars/domain/models/cars.model'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('cars')
export class Car implements CarModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  model: string

  @Column()
  year: string

  @Column('decimal')
  valuePerDay: number

  @Column('int')
  numberOfPassengers: number

  @Column('json')
  accessories: TypeAccessories[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export type TypeAccessories = {
  id: string
  description: string
}
