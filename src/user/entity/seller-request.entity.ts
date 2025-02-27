import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entity";

@Entity()
export class SellerRequest {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    user: User;

    @Column({ type: 'enum', enum: ['PENDING', 'APPROVED', "REJECTED"], default: 'PENDING' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}