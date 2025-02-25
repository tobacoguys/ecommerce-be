import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import User from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async updateProfile( userId: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const { username, bio, birthday, phone, address } = updateUserDto;
        if (username) user.username = username;
        if (bio) user.bio = bio;
        if (birthday) user.birthday = birthday;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        await this.userRepository.save(user);
        return user;
    }
}
