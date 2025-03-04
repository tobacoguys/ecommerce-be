import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import User, { UserRole } from 'src/user/entity/user.entity';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)
    @Post('/create')
    async createCategory(@Req() req: { user: User }, @Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.createCategory(req.user, createCategoryDto);
    }

    @Get()
    async findAll() {
        return this.categoryService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.ADMIN)
    @Patch('/:id')
    async update(@Req() req: { user: User }, @Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(req.user ,id, updateCategoryDto);
    }
}
