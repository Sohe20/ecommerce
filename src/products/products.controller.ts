import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import express from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto , @Res() res: express.Response) {
    const product = await this.productsService.create(createProductDto);

     return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: product,
      message: 'محصول جدید با موفقیت ساخته شد',
    });
  }

  @Get()
  async findAll(@Res() res: express.Response) {
    const products = await this.productsService.findAll();

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: products,
      message: 'لیست محصولات  با موفقیت دریافت شد',
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string , @Res() res: express.Response) {
    const product = await this.productsService.findOne(+id);

     return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: product,
      message: ' محصول موردنظر با موفقیت دریافت شد',
    });
  }





  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto , @Res() res: express.Response) {

    const product = await this.productsService.update(+id, updateProductDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: product,
      message: 'محصول مورد نظر با موفقیت بروزرسانی شد',
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
