import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Product from './product.entity';
import User, { UserRole } from 'src/user/entity/user.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async createProduct(user: User, createProductDto: CreateProductDto): Promise<Product> {
        if (user.role !== UserRole.SELLER) {
          throw new ForbiddenException('Only sellers can create products');
        }
    
        const product = this.productRepository.create({
          ...createProductDto,
          seller: user,
        });
    
        return this.productRepository.save(product);
      }

    async getMyProduct(user: User): Promise<Product[]> {
        if (user.role !== UserRole.SELLER) {
          throw new ForbiddenException('Only sellers can create products');
        }

        return this.productRepository.find({ where: { seller: user } });
    }

    async updateProduct(user: User, productId: string, updateData: Partial<Product>): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id: productId }, relations: ['seller'] });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.seller.id !== user.id) {
            throw new ForbiddenException('You are not the owner of this product');
        }

        Object.assign(product, updateData);
        return this.productRepository.save(product);
    }
}
