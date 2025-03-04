import { ForbiddenException, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import User, { UserRole } from 'src/user/entity/user.entity';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async createCategory(user: User, createCategoryDto: CreateCategoryDto): Promise<Category> {
        if (user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Only admins can create categories');
        }

        const existingCategory = await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } });
        if (existingCategory) {
            throw new ConflictException('Category name already exists');
        }

        const category = this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(category);
    }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async update(user: User, id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        if (user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Only admins can update categories');
        }

        const category = await this.findOne(id);
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const existingCategory = await this.categoryRepository.findOne({ where: { name: updateCategoryDto.name } });
            if (existingCategory) {
                throw new ConflictException('Category name already exists');
            }
        }

        Object.assign(category, updateCategoryDto);
        return this.categoryRepository.save(category);
    }

    async remove(user: User, id: string): Promise<{ message: string }> {
        if (user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Only admins can delete categories');
        }

        const category = await this.findOne(id);
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        await this.categoryRepository.delete(category);
        return { message: 'Category deleted successfully' };
    }
}
