import { IsDate, IsNumber, IsString } from "class-validator";

export class UpdateUserDto {
    @IsString()
    username: string;

    @IsString()
    bio: string;

    @IsDate()
    birthday: string;

    @IsNumber()
    phone: string;

    @IsString()
    address: string;
}