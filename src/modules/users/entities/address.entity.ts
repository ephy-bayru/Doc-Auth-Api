import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  region: string;

  @Column()
  city: string;

  @Column()
  subCity: string;

  @Column()
  wereda: string;

  @Column()
  kebele: string;

  @Column()
  houseNo: number;

  @OneToOne(() => Users, (user) => user.address)
  @JoinColumn()
  user: Users;
}
