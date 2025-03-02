import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/auth/decorator/role.decorator';
import User, { UserRole } from 'src/user/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.SELLER)
    async createProduct(@Req() req: { user: User }, @Body() createProductDto: CreateProductDto) {
        return this.productService.createProduct(req.user, createProductDto);
      }
}
