import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import User from 'src/user/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post('/add')
    @UseGuards(JwtAuthGuard)
    async addToCart(@Req() req: { user: User }, @Body() addToCartDto: AddToCartDto) {
        return this.cartService.addToCart(req.user.id, addToCartDto);
    }
}
