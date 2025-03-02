import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/auth/decorator/role.decorator';
import { UserRole } from 'src/user/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.SELLER)
    async createProduct(@Req() req, @Body() data) {
        const user = req.user;
        return await this.productService.createProduct(user, data);
    }
}
