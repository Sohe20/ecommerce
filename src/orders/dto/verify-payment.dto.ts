import {
    IsNumber,
    IsNotEmpty,
} from 'class-validator';

export class VerifyPaymentDto {
    @IsNumber()
    @IsNotEmpty({ message: '   کد تراکنش  نمی‌تواند خالی باشد' })
    trackId: number;

    @IsNumber()
    @IsNotEmpty({ message: '   ایدی سفارش  نمی‌تواند خالی باشد' })
    order_id: number;


}