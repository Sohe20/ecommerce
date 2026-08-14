import {
    IsNumber,
    IsNotEmpty,
    IsPositive,
    IsInt,
} from 'class-validator';

export class CreateOrderItemDto {
    @IsNumber({}, { message: 'شناسه محصول باید یک عدد باشد' })
    @IsNotEmpty({ message: 'شناسه محصول نمی‌تواند خالی باشد' })
    @IsPositive({ message: 'شناسه محصول باید بزرگتر از ۰ باشد' })
    productId: number;

    // اضافه شد: ستون quantity روی OrderItem الزامی (بدون nullable/default) هست،
    // بدون این فیلد insert کردن OrderItem با خطای دیتابیس مواجه می‌شه
    @IsInt({ message: 'تعداد باید یک عدد صحیح باشد' })
    @IsPositive({ message: 'تعداد باید بزرگتر از ۰ باشد' })
    quantity: number;
}