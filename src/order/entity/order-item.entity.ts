import { Exclude } from 'class-transformer';
import { Order } from './order.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Product from 'src/product/product.entity';

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => Order, (order) => order.item, { onDelete: 'CASCADE' })
    @Exclude()
    order: Order;

    @ManyToOne(() => Product, { onDelete: 'SET NULL' })
    product: Product;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    price: number;
}
