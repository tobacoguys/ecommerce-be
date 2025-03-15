import User from "src/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

@Entity() 
export class Order {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => User, (user) => user.order, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    item: OrderItem[];

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    totalPrice: number;

    @Column({ type: 'enum', enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], default: 'PENDING' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;
}