import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entity/order.entity';
import Product from 'src/product/product.entity';
import { OrderItem } from './entity/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, OrderItem])],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
