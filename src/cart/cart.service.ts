import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import Product from 'src/product/product.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
        const product = await this.productRepository.findOne({ where: { id: addToCartDto.productId } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        let cart = await this.cartRepository.findOne({ where: { user: { id: userId }, product: { id: addToCartDto.productId } } });
        if (cart) {
            cart.quantity += addToCartDto.quantity;
        } else {
            cart = this.cartRepository.create({ user: { id: userId }, product, quantity: addToCartDto.quantity });
        }

        return this.cartRepository.save(cart);
    }
}
