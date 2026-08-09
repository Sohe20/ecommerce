import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateBookmarkProductDto {
  @IsNotEmpty({ message: 'شناسه محصول اجباری است' })
  @IsNumber({}, { message: 'شناسه محصول باید عدد باشد' })
  @Min(1, { message: 'شناسه محصول باید بزرگتر از صفر باشد' })
  productId: number;

  @IsNotEmpty({ message: 'شناسه کاربر اجباری است' })
  @IsNumber({}, { message: 'شناسه کاربر باید عدد باشد' })
  @Min(1, { message: 'شناسه کاربر باید بزرگتر از صفر باشد' })
  userId: number;
}