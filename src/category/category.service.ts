import { ForbiddenException, Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import User, { UserRole } from 'src/user/entity/user.entity';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';

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
}
