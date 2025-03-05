import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/auth/decorator/role.decorator';
import User, { UserRole } from 'src/user/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import Product from './product.entity';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.SELLER)
    async createProduct(@Req() req: { user: User }, @Body() createProductDto: CreateProductDto, @Body('categoryId') categoryId: string) {
        return this.productService.createProduct(req.user, createProductDto, categoryId);
    }

    @Get('/my-product')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.SELLER)
    async getMyProduct(@Req() req: { user: User }) {
        return this.productService.getMyProduct(req.user);
    }

    @Patch('/:productId')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.SELLER)
    async updateProduct(@Req() req: { user: User }, @Param('productId') productId: string, @Body() updateData: Partial<Product>) {
        return this.productService.updateProduct(req.user, productId, updateData);
    }

    @Delete('/:productId')
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.SELLER)
    async deleteProduct(@Req() req: { user: User }, @Param('productId') productId: string) {
        return this.productService.deleteProduct(req.user, productId);
    }
}
