import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import Product from 'src/product/product.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToMany(() => Product, product => product.category)
    products: Product[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}