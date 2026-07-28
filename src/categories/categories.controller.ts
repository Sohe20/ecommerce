import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import express from 'express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @Res() res: express.Response) {
    const newCategory = await this.categoriesService.create(createCategoryDto);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: newCategory,
      message: 'دسته بندی جدید با موفقیت ساخته شد',
    });
  }

  @Get()
  async findAll(@Res() res: express.Response) {
    const categories = await this.categoriesService.findAll();

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: categories,
      message: 'لیست دسته بندی ها با موفقیت دریافت شد',
    });

  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: express.Response) {
    const category = await this.categoriesService.findOne(+id);

     return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: category,
      message: 'دسته بندی موردنظر با موفقیت دریافت شد',
    });
  }

  @Put(':id')
  async  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Res() res: express.Response) {
    const category = await this.categoriesService.update(+id, updateCategoryDto);

     return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: category,
      message: 'دسته بندی مورد نظر با موفقیت بروزرسانی شد',
    });

  }

  @Delete('remove-only-category/:id')
  async  removeonly(@Param('id') id: string, @Res() res: express.Response) {
     await this.categoriesService.removeOnlyCategory(+id);

     return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'دسته بندی مورد نظر با موفقیت حذف شد',
    });
  }

  @Delete('safe-remove/:id')
  async  safeRemove(@Param('id') id: string, @Res() res: express.Response) {
     await this.categoriesService.safeRemove(+id);

     return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'دسته بندی مورد نظر با موفقیت حذف شد',
    });
  }

   @Delete('remove/:id')
  async  remove(@Param('id') id: string, @Res() res: express.Response) {
     await this.categoriesService.remove(+id);

     return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'دسته بندی مورد نظر با موفقیت حذف شد',
    });
  }

}
