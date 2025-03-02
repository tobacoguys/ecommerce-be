import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Product from './product.entity';
import User, { UserRole } from 'src/user/entity/user.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async createProduct(user: User, data: Partial<Product>): Promise<Product> {
        if (user.role !== UserRole.SELLER) {
            throw new ForbiddenException('Only sellers can create products');
        }

        const newProduct = this.productRepository.create({
            ...data,
            seller: user,
        });

        const savedProduct = await this.productRepository.save(newProduct);
        return savedProduct;
    }
}
