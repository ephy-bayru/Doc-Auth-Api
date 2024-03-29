import { Admin } from 'src/modules/Admin/entities/admins.entity';
import { Certificate } from 'src/modules/Certificates/entities/certificate.entity';
import { Document } from 'src/modules/Documents/entities/document.entity';
import { Organization } from 'src/modules/Organizations/entities/organization.entity';
import { Role } from 'src/modules/Roles/entities/role.entity';
import { Notification } from 'src/modules/Notifications/entities/notifications.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  ethereumAddress?: string; // Address used for blockchain transactions

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @OneToMany(() => Document, (document) => document.owner)
  documents: Document[];

  @OneToMany(() => Certificate, (certificate) => certificate.owner)
  certificates: Certificate[];

  @ManyToOne(() => Organization, (organization) => organization.users, {
    nullable: true,
  })
  organization?: Organization;

  @ManyToOne(() => Admin, (admin) => admin.users, { nullable: true })
  admin?: Admin;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
