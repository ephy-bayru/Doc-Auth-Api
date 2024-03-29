import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Document } from 'src/modules/documents/entities/document.entity';

@Entity({ name: 'certificates' })
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tokenId: string;

  @ManyToOne(() => Document, (document) => document.certificates, {
    eager: false,
  })
  @JoinColumn({ name: 'documentId' })
  document: Document;

  @ManyToOne(() => User, (user) => user.certificates, { eager: false })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ default: false })
  authorized: boolean;
}
