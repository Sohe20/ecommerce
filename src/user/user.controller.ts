import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import express from 'express';
import userRoleEnum from './enum/userRoleEnum';
import { plainToInstance } from 'class-transformer';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Res() res: express.Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const createUser = await this.userService.create(createUserDto);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: createUser,
      message: 'کاربر جدید با موفقیت ساخته شد',
    });
  }

  @Get()
  async findAll(
    @Res() res: express.Response,
    @Query('role') role?: userRoleEnum ,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    const users = await this.userService.findAll(role, limit, page);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: users,
      message: 'لیست کاربر ها  با موفقیت دریافت شد',
    });
  }

  @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: express.Response) {
    const user = await this.userService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: user,
      message: ' پروژه با موفقیت دریافت شد',
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() Body :any,
    @Res() res: express.Response,
  ) {
    const updateUserDto = plainToInstance(UpdateUserDto,Body,{
      excludeExtraneousValues:true
    })
    const user = await this.userService.update(+id, updateUserDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: user,
      message: 'کاربر شما با موفقیت ویرایش شد',
    });

    
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: express.Response) {
    await this.userService.remove(+id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: null,
      message: 'کاربر با موفقیت حذف شد',
    });
  }
}
