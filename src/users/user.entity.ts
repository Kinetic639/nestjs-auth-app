import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoles } from '../types';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({ default: UserRoles.USER })
  role: UserRoles;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    nullable: true,
    length: 255,
    default: null,
  })
  token: string;
}
