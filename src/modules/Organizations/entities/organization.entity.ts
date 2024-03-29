import { Admin } from 'src/modules/Admin/entities/admins.entity';
import { Document } from 'src/modules/documents/entities/document.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Notification } from 'src/modules/notifications/entities/notifications.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'organizations' })
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  ethereumAddress?: string;

  @ManyToOne(() => Admin, (admin) => admin.organizations)
  @JoinColumn({ name: 'adminId' })
  admin?: Admin;

  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @OneToMany(() => Document, (document) => document.owningOrganization)
  ownedDocuments: Document[];

  @OneToMany(() => Document, (document) => document.authorizingOrganization)
  authorizedDocuments: Document[];

  @OneToMany(() => Notification, (notification) => notification.organization)
  notifications: Notification[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
