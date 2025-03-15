import { IsArray, IsInt, IsString, Min, ValidateNested } from "class-validator";

class OrderItemDto {
    @IsString()
    productId: string;

    @IsInt()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    items: OrderItemDto[];
}
