import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserTypes } from '../types';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: UserTypes.USER })
  role: UserTypes;

  @Column({ default: true })
  isActive: boolean;
}
