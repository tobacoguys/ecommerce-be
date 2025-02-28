import { BadRequestException, Injectable } from '@nestjs/common';
import User, { UserRole } from 'src/user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellerRequest, SellerRequestStatus } from 'src/user/entity/seller-request.entity';

@Injectable()
export class CmsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(SellerRequest)
        private readonly sellerRequestRepository: Repository<SellerRequest>,
    ) {}

    async approveSeller(userId: string): Promise<{ message: string }> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || !user.isSellerRequestPending) {
            throw new BadRequestException('User not found or seller request is not pending');
        }

        user.role = UserRole.SELLER;
        user.isSellerRequestPending = false;
        await this.userRepository.save(user);

        await this.sellerRequestRepository.update(
            { user: { id: userId }, status: SellerRequestStatus.PENDING },
            { status: SellerRequestStatus.APPROVED },
        )

        return { message: 'Seller request approved successfully' };
    }

    async rejectSeller(userId: string): Promise<{ message: string }> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || !user.isSellerRequestPending) {
            throw new BadRequestException('User not found or seller request is not pending');
        }

        user.isSellerRequestPending = false;
        await this.userRepository.save(user);

        return { message: 'Seller request rejected successfully' };
    }
}
