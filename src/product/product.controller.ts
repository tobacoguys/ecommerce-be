import { Body, Controller, Post, Req } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('/create-product')
    async createProduct(@Req() req, @Body() data) {
        return await this.productService.createProduct(req, data);
    }
}
