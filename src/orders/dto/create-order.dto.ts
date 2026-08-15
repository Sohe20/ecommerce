import {
    IsNumber,
    IsOptional,
    IsPositive,
    Min,
    IsNotEmpty,
    IsString,
    IsEnum,
    IsDateString,
    IsArray,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../enums/order-status.enum';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
    @IsNumber({}, { message: 'شناسه کاربر باید یک عدد باشد' })
    @IsNotEmpty({ message: 'شناسه کاربر نمی‌تواند خالی باشد' })
    @IsPositive({ message: 'شناسه کاربر باید بزرگتر از ۰ باشد' })
    userId: number;

    @IsEnum(OrderStatus, { message: 'وضعیت سفارش معتبر نمی‌باشد' })
    @IsOptional()
    status?: OrderStatus;

    @IsDateString({}, { message: 'زمان پرداخت باید یک تاریخ معتبر باشد' })
    @IsOptional()
    payedTime?: Date;

    @IsNumber({}, { message: 'شناسه آدرس باید یک عدد باشد' })
    @IsNotEmpty({ message: 'آدرس نمی‌تواند خالی باشد' })
    @IsPositive({ message: 'شناسه آدرس باید بزرگتر از ۰ باشد' })
    addressId: number;



    @IsString({ message: 'کد تخفیف باید یک رشته باشد' })
    @IsOptional()
    discountCode?: string | null;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}