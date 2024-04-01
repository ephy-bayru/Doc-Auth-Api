import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Organization } from 'src/modules/organizations/entities/organization.entity';
import { Admin } from 'src/modules/Admin/entities/admins.entity';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column('text')
  message: string;

  @ManyToOne(() => User, (user) => user.notifications, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ManyToOne(() => Organization, (organization) => organization.notifications, {
    nullable: true,
  })
  @JoinColumn({ name: 'organizationId' })
  organization?: Organization;

  @ManyToOne(() => Admin, (admin) => admin.notifications, { nullable: true })
  @JoinColumn({ name: 'adminId' })
  admin?: Admin;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
