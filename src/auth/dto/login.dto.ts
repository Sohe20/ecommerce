import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
  
} from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsString({ message: 'موبایل باید یک رشته باشد' })
  @Length(11, 11, { message: 'شماره موبایل باید 11 رقم باشد' })
  @IsNotEmpty({ message: 'موبایل نمیتواند خالی باشد' })
  @Transform(({ value }) => value.trim())
  mobile: string;


  @IsString({message:'رمز عبور باید یک رشته باشد'})
  @IsNotEmpty({ message: 'رمز عبور نمیتواند خالی باشد' })
  // @MinLength(8,{message:'رمز عبور باید حداقل 8 کارکتر باشد'})
  @MaxLength(16,{message:'رمز عبور باید حداکثر 16 کارکتر باشد'})
  password:string
}
