import {
    IsNumber,
    IsNotEmpty,
    IsPositive,
    IsInt,
} from 'class-validator';

export class PaymentOrderDto {
    @IsNumber()
    @IsNotEmpty({ message: '   ایدی سفارش  نمی‌تواند خالی باشد' })
    order_id: number;


}