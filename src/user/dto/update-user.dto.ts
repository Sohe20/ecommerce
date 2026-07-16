import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import userRoleEnum from '../enum/userRoleEnum';

export class UpdateUserDto {
  @IsString({ message: 'نام باید یک رشته باشد' })
  @IsNotEmpty({ message: 'نام نمیتواند خالی باشد' })
  display_name: string;

  @IsEnum(userRoleEnum, {
    message: 'نقش کاربر باید یکی از مقادیر (admin , user)باشد',
  })
  @IsOptional()
  role: userRoleEnum;
}
