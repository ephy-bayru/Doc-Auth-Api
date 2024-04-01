import { Certificate } from 'src/modules/Certificates/entities/certificate.entity';
import { Organization } from 'src/modules/Organizations/entities/organization.entity';
import { User } from 'src/modules/Users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'documents' })
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  hash: string;

  @Column({ default: false })
  original: boolean;

  @Column({ default: false })
  authorized: boolean;

  @Column({ nullable: true })
  tokenId: string;

  @Column()
  fileName: string;

  @Column()
  fileType: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: false })
  deleted: boolean;

  @Column({ default: 'uploaded' })
  status:
    | 'uploaded'
    | 'pending'
    | 'authorized'
    | 'revoked'
    | 'deleted'
    | 'rejected'
    | 'error'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'expired'
    | 'archived';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.documents, { eager: false })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ManyToOne(
    () => Organization,
    (organization) => organization.ownedDocuments,
    { nullable: true },
  )
  @JoinColumn({ name: 'owningOrganizationId' })
  owningOrganization?: Organization;

  @ManyToOne(
    () => Organization,
    (organization) => organization.authorizedDocuments,
    { nullable: true },
  )
  @JoinColumn({ name: 'authorizingOrganizationId' })
  authorizingOrganization?: Organization;

  @OneToMany(() => Certificate, (certificate) => certificate.document, {
    eager: false,
  })
  certificates: Certificate[];
}
