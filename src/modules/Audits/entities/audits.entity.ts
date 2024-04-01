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

@Entity({ name: 'audits' })
export class Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column('text', { nullable: true })
  details: string;

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
  timestamp: Date;
}
