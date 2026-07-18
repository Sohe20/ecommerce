import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto , @Res() res: express.Response,) {
    const register = await this.authService.register(
      registerDto.mobile,
      registerDto.password,
      registerDto.display_name,
    );

     return res.status(HttpStatus.OK).json({
           statusCode: HttpStatus.OK,
           data: register,
           message: 'کاربر شما با موفقیت ثبت نام شد',
         });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto , @Res() res: express.Response,) {
    const login = await this.authService.login(loginDto.mobile, loginDto.password);

     return res.status(HttpStatus.OK).json({
           statusCode: HttpStatus.OK,
           data: login,
           message: 'کاربر شما با موفقیت وارد شد',
         });
  }
}
