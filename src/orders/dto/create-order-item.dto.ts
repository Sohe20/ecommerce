// src/orders/dto/create-order-item.dto.ts
import {
    IsNumber,
    IsNotEmpty,
    IsPositive,
    IsInt,
    IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
    @IsNumber({}, { message: 'شناسه محصول باید یک عدد باشد' })
    @IsNotEmpty({ message: 'شناسه محصول نمی‌تواند خالی باشد' })
    @IsPositive({ message: 'شناسه محصول باید بزرگتر از ۰ باشد' })
    productId: number;
}