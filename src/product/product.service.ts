import { ForbiddenException, Injectable } from '@nestjs/common';
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
}
