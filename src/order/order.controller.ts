import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import User from 'src/user/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createOrder(@Req() req: { user: User }, @Body() createOrderDto: CreateOrderDto) {
        const userId = req.user.id;
        return this.orderService.createOrder(userId, createOrderDto);
    }
}
