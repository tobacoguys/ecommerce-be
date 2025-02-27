import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entity/user.entity';
import { SellerRequest } from './entity/seller-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SellerRequest])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
