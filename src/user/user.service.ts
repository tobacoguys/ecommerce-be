import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import User, { UserRole } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SellerRequest, SellerRequestStatus } from './entity/seller-request.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(SellerRequest)
        private readonly requestSellerRepository: Repository<SellerRequest>
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

    async requestSeller(userId: string): Promise<{ message: string }> {
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['sellerRequests'] });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.isSellerRequestPending || user.role === UserRole.SELLER) {
            throw new BadRequestException('You have submitted a request or are already a Seller');
        }

        user.isSellerRequestPending = true;
        await this.userRepository.save(user);

        const newRequest = this.requestSellerRepository.create({ 
            user, 
            status: SellerRequestStatus.PENDING 
        });
        await this.requestSellerRepository.save(newRequest);

        return { message: 'Request submitted successfully' };
    }
}
