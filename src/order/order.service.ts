import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import Product from 'src/product/product.entity';
import { OrderItem } from './entity/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
    ) {}

    async createOrder(userId: string, createOrderDto: CreateOrderDto) {
        const order = this.orderRepository.create({
            user: { id: userId },
            status: 'PENDING',
            totalPrice: 0,
            item: [],
        });
        
        let totalPrice = 0;
        const orderItems: OrderItem[] = [];
        
        for (const item of createOrderDto.item as { productId: string, quantity: number }[]) {
            const product = await this.productRepository.findOne({ where: { id: item.productId } });
            if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
        
            const orderItem = this.orderItemRepository.create({
                product,
                quantity: item.quantity,
                price: product.price * item.quantity,
            });
        
            totalPrice += orderItem.price;
            orderItems.push(orderItem);
        }
        
        order.totalPrice = totalPrice;
        const savedOrder = await this.orderRepository.save(order);
        
        for (const orderItem of orderItems) {
            orderItem.order = savedOrder;
            await this.orderItemRepository.save(orderItem);
        }
        
        savedOrder.item = orderItems;
        return this.orderRepository.findOne({
            where: { id: savedOrder.id },
            relations: ['item', 'item.product', 'user'],
        });
        
        
    }
}
