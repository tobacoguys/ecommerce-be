import {  Injectable, NotFoundException } from '@nestjs/common';
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

    async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<{ cart: Cart[], totalAmount: number }> {
        const product = await this.productRepository.findOne({ 
            where: { id: addToCartDto.productId },
            select: ['id', 'price']  
        });
    
        if (!product) {
            throw new NotFoundException('Product not found');
        }
    
        // Tìm sản phẩm đó trong giỏ hàng của user
        let cartItem = await this.cartRepository.findOne({ 
            where: { user: { id: userId }, product: { id: addToCartDto.productId } },
            relations: ['product']
        });
    
        if (cartItem) {
            // Ép kiểu quantity về số trước khi cộng dồn
            cartItem.quantity = Number(cartItem.quantity) + Number(addToCartDto.quantity);
            cartItem.totalPrice = cartItem.quantity * product.price;
        } else {
            cartItem = this.cartRepository.create({
                user: { id: userId },
                product,
                quantity: Number(addToCartDto.quantity), // Chắc chắn là số
                totalPrice: Number(addToCartDto.quantity) * product.price
            });
        }
    
        await this.cartRepository.save(cartItem);
    
        // Lấy danh sách giỏ hàng của user
        const cart = await this.cartRepository.find({
            where: { user: { id: userId } },
            relations: ['product']
        });
    
        // Tính tổng tiền của toàn bộ giỏ hàng
        const totalAmount = cart.reduce((sum, item) => sum + Number(item.totalPrice), 0);

        return { cart, totalAmount };
    }
    
}
