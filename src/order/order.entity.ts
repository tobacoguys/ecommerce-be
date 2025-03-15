import User from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity() 
export class Order {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => User, (user) => user.order, { onDelete: 'CASCADE' })
    user: User;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    totalPrice: number;

    @Column({ type: 'enum', enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], default: 'PENDING' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}