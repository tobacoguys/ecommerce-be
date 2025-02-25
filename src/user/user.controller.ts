import { Body, Controller, Patch, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { Request as ExpressRequest } from 'express';

interface RequestWithUser extends ExpressRequest {
    user: {
        id: string;
        // add other user properties if needed
    };
}

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Patch('/profile')
    @UseGuards(JwtAuthGuard)
    async updateProfile(@Request() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto) {
        const userId = req.user.id;
        const updatedUser = await this.userService.updateProfile(
            userId,
            updateUserDto,
        );
        return { message: 'Profile updated successfully', data: updatedUser };
    }
}
