import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    async signup(@Body() signupDto: SignupDto): Promise<{ message: string }> {
        return await this.authService.signup(signupDto);
    }

    @Post('/verify-otp')
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
        return await this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
    }
}
