import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Product from './product.entity';
import User, { UserRole } from 'src/user/entity/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from 'src/category/entity/category.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async createProduct(user: User, createProductDto: CreateProductDto, categoryId: string): Promise<Product> {
        if (!categoryId) {
            throw new NotFoundException('Category ID is required');
        }

        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        if (user.role !== UserRole.SELLER) {
          throw new ForbiddenException('Only sellers can create products');
        }
    
        const product = this.productRepository.create({
            ...createProductDto,
            seller: user,
            category,
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

    async deleteProduct(user: User, productId: string): Promise<{ message: string }> {
        const product = await this.productRepository.findOne({ where: { id: productId }, relations: ['seller'] });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.seller.id !== user.id) {
            throw new ForbiddenException('You are not the owner of this product');
        }

        await this.productRepository.delete(product);
        return { message: 'Product deleted successfully' };
    }

    async findAll(): Promise<Product[]> {
        return this.productRepository.find();
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({ 
            where: { id },
            relations: ['seller', 'category']
        });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async findByCategory(categoryId: string): Promise<Product[]> {
        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return this.productRepository.find({ where: { category: { id: categoryId } }, relations: ['seller', 'category'] });
    }

    async findBySeller(sellerId: string): Promise<Product[]> {
        const seller = await this.productRepository.findOne({ where: { seller: { id: sellerId } }, relations: ['seller'] });
        if (!seller) {
            throw new NotFoundException('Seller not found');
        }
        return this.productRepository.find({ where: { seller: { id: sellerId } }, relations: ['seller', 'category'] });
    }
}
