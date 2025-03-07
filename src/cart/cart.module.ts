import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Product from 'src/product/product.entity';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Cart])],
    providers: [CartService],
    exports: [CartService],
    controllers: [CartController],
})
export class CartModule {}
