import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import User from 'src/user/entity/user.entity';

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export default Product;