import { IsEnum } from "class-validator";

export class UpdateOrderStatusDto {
    @IsEnum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    status: string;
}