import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import User from 'src/user/entity/user.entity';
import { Category } from 'src/category/entity/category.entity';
import { Cart } from "src/cart/cart.entity";

@Entity('product')
class Product {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2})
    price: number;

    @Column({ type: 'int', default: 0})
    stock: number;
    
    @Column({ nullable: true })
    image: string;

    @ManyToOne(() => User, user => user.products)
    seller: User;

    @ManyToOne(() => Category, category => category.products)
    category: Category;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Cart, (cart) => cart.product)
    cart: Cart[];
}

export default Product;