import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/user/user.entity';
import { SignupDto } from './dto/signup.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async signup(signupDto: SignupDto): Promise<{ message: string }> {
        const { email, password } = signupDto;

        const existingUser = await this.userRepository.findOne({ where : { email } });
        if (existingUser) {
            throw new UnauthorizedException ( 'Email already in use' );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            email,
            password: hashedPassword,
        })

        await this.userRepository.save(user);

        return { message: 'User created successfully' };
    }
}
