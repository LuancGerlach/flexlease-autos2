import { UserModel } from '@/users/domain/models/users.model'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('users')
export class User implements UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  cpf: string

  @Column()
  birth: string

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  cep: string

  @Column()
  qualified: string

  @Column()
  patio: string

  @Column()
  complement: string

  @Column()
  neighborhood: string

  @Column()
  locality: string

  @Column()
  uf: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
