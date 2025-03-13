import {  Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import Product from 'src/product/product.entity';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<{ cart: Cart[], totalAmount: number }> {
        const product = await this.productRepository.findOne({ 
            where: { id: addToCartDto.productId },
            select: ['id', 'price']  
        });
    
        if (!product) {
            throw new NotFoundException('Product not found');
        }
    
        let cartItem = await this.cartRepository.findOne({ 
            where: { user: { id: userId }, product: { id: addToCartDto.productId } },
            relations: ['product']
        });
    
        if (cartItem) {
            cartItem.quantity = Number(cartItem.quantity) + Number(addToCartDto.quantity);
            cartItem.totalPrice = cartItem.quantity * product.price;
        } else {
            cartItem = this.cartRepository.create({
                user: { id: userId },
                product,
                quantity: Number(addToCartDto.quantity),
                totalPrice: Number(addToCartDto.quantity) * product.price
            });
        }
    
        await this.cartRepository.save(cartItem);
    
        const cart = await this.cartRepository.find({
            where: { user: { id: userId } },
            relations: ['product']
        });
    
        const totalAmount = cart.reduce((sum, item) => sum + Number(item.totalPrice), 0);

        return { cart, totalAmount };
    }
    
    async getCart(userId: string) {
        return this.cartRepository.find({ where: { user: { id: userId } }, relations: ['product'] });
      }

    async updateCart(cartId: string, updateCartDto: UpdateCartDto): Promise<{ cart: Cart[], totalAmount: number }> {
        const cartItem = await this.cartRepository.findOne({ 
            where: { id: cartId },
            relations: ['product', 'user'] 
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        cartItem.quantity = updateCartDto.quantity;
        cartItem.totalPrice = cartItem.quantity * cartItem.product.price;

        await this.cartRepository.save(cartItem);

        const cart = await this.cartRepository.find({
            where: { user: { id: cartItem.user.id } },
            relations: ['product']
        });

        const totalAmount = cart.reduce((sum, item) => sum + Number(item.totalPrice), 0);

        return { cart, totalAmount };
    }
}
