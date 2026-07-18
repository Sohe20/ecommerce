import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateAddressDto {

  @IsNotEmpty({message:'کاربر نمیتواند خالی باشد '})
  userId: number;

  @IsString({message:'استان باید یک رشته باشد'})
  @IsNotEmpty({message:'استان نمیتواند خالی باشد '})
  province: string;

  @IsString({message:'شهر باید یک رشته باشد  باشد '})
  @IsNotEmpty({message:'شهر نمیتواند خالی باشد '})
  city: string;


   @IsString({message:'آدرس باید یک رشته باشد '})
  @IsNotEmpty({message:'آدرس نمیتواند خالی باشد '})
  address: string;

  @IsString()
  @Length(10,10,{message:'کد پستی باید 10رقم باشد'})
  postal_code:string

 

  
  @IsString({message:'شماره موبایل گیرنده نمیتواند خالی باشد'})
  @Length(11,11,{message:'شماره موبایل گیرنده حتما باید 11 رقم باشد'})
  reciver_mobile:string

  @IsOptional()
  @IsString({message:'توضیحات باید یک رشته باشد'})
  description?:string
  
}
