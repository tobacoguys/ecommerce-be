import Product from "src/product/product.entity";
import User from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Product, (product) => product.cart, { onDelete: 'CASCADE' })
    product: Product;

    @Column({ type: 'int', default: 1 })
    quantity: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    totalPrice: number;
}