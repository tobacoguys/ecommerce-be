import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import User from './user.entity';

export enum SellerRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity()
export class SellerRequest {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.sellerRequests, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  username: string;

  @Column({ type: 'enum', enum: SellerRequestStatus, default: SellerRequestStatus.PENDING })
  status: SellerRequestStatus;

  @CreateDateColumn()
  createdAt: Date;
}
