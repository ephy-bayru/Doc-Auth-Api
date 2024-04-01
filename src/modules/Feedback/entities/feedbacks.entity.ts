import { Organization } from 'src/modules/organizations/entities/organization.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Admin,
} from 'typeorm';

@Entity({ name: 'feedback' })
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  message: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ManyToOne(() => Admin, { nullable: true })
  @JoinColumn({ name: 'adminId' })
  admin?: Admin;

  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'organizationId' })
  organization?: Organization;

  @CreateDateColumn()
  createdAt: Date;

  @Column('reviewed')
  reviewed: boolean;

  @Column('resolved')
  resolved: boolean;
}
