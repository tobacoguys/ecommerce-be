import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/user/entity/user.entity';
import { SignupDto } from './dto/signup.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
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
            isActive: false,
        })

        await this.userRepository.save(user);
        
        const otp = this.generateOtp();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await this.userRepository.save(user);

        await this.sendOtpEmail(email, otp);

        return { message: 'Account created. Please verify your OTP sent to your email.' };
    }

    
  private async sendOtpEmail(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });

    await transporter.sendMail({
      from: this.configService.get<string>('EMAIL_FROM'),
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`,
    });
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async verifyOtp(email: string, otp: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    user.isActive = true;
    await this.userRepository.save(user);

    return { message: 'Account activated successfully' };
  }

  async login(loginDto: LoginDto): Promise<{ user: any, token: string }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is not activated. Please verify OTP.');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    return { user, token };
  }
}