import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import User from 'src/user/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Post('/add')
    @UseGuards(JwtAuthGuard)
    async addToCart(@Req() req: { user: User }, @Body() addToCartDto: AddToCartDto) {
        return this.cartService.addToCart(req.user.id, addToCartDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getCart(@Req() req: { user: User }) {
      return this.cartService.getCart(req.user.id);
    }

    @Patch('/update/:cartId')
    @UseGuards(JwtAuthGuard)
    async updateCart(@Param('cartId') cartId: string, @Body() updateCartDto: UpdateCartDto) {
        return this.cartService.updateCart(cartId, updateCartDto);
    }

    @Patch('/decrease/:cartId')
    @UseGuards(JwtAuthGuard)
    async decreaseCart(@Param('cartId') cartId: string, @Body() updateCartDto: UpdateCartDto) {
        return this.cartService.decreaseCart(cartId, updateCartDto);
    }

    @Delete('/remove/:cartId')
    @UseGuards(JwtAuthGuard)
    async removeCart(@Req() req: { user: User }, @Param('cartId') cartId: string) {
        return this.cartService.removeCart(cartId, req.user.id);
    }

    @Delete('/delete')
    @UseGuards(JwtAuthGuard)
    async clearCart(@Req() req: { user: User }) {
        return this.cartService.clearCart(req.user.id);
    }
}
