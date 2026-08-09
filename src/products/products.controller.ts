import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
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

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: products,
      message: 'لیست محصولات با موفقیت دریافت شد',
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number , @Res() res: express.Response) {
    const product = await this.productsService.findOne(id);

     return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: product,
      message: 'محصول موردنظر با موفقیت دریافت شد',
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProductDto: UpdateProductDto , 
    @Res() res: express.Response
  ) {
    const product = await this.productsService.update(id, updateProductDto);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: product,
      message: 'محصول مورد نظر با موفقیت بروزرسانی شد',
    });
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number, 
    @Res() res: express.Response
  ) {
    const result = await this.productsService.remove(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'محصول با موفقیت حذف شد',
    });
  }

  // =============== متدهای بوکمارک ===============

  // 1. تگل بوکمارک (ثبت یا حذف)
  @Post(':productId/bookmark/toggle')
  async toggleBookmark(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('userId', ParseIntPipe) userId: number,
    @Res() res: express.Response,
  ) {
    const result = await this.productsService.toggleBookmark(productId, userId);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: result,
      message: result.message,
    });
  }

  // 2. بررسی وضعیت بوکمارک
  @Get(':productId/bookmark/status')
  async checkBookmarkStatus(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('userId', ParseIntPipe) userId: number,
    @Res() res: express.Response,
  ) {
    const isBookmarked = await this.productsService.checkBookmarkStatus(productId, userId);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { productId, userId, isBookmarked },
      message: 'وضعیت بوکمارک با موفقیت دریافت شد',
    });
  }

  // 3. دریافت تعداد بوکمارک‌های یک محصول
  @Get(':productId/bookmark/count')
  async getProductBookmarksCount(
    @Param('productId', ParseIntPipe) productId: number,
    @Res() res: express.Response,
  ) {
    const count = await this.productsService.getProductBookmarksCount(productId);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { productId, count },
      message: 'تعداد بوکمارک‌ها با موفقیت دریافت شد',
    });
  }

  // 4. دریافت لیست بوکمارک‌های یک کاربر (محصولات بوکمارک شده)
  @Get('bookmarks/user/:userId')
  async getUserBookmarks(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: express.Response,
  ) {
    const bookmarks = await this.productsService.getUserBookmarks(userId);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: bookmarks,
      message: 'لیست بوکمارک‌های کاربر با موفقیت دریافت شد',
    });
  }

  // 5. دریافت همه محصولات با وضعیت بوکمارک برای یک کاربر
  @Get('with-bookmark-status')
  async getProductsWithBookmarkStatus(
    @Query('userId', ParseIntPipe) userId: number,
    @Res() res: express.Response,
  ) {
    const products = await this.productsService.getProductsWithBookmarkStatus(userId);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: products,
      message: 'لیست محصولات با وضعیت بوکمارک با موفقیت دریافت شد',
    });
  }

  // 6. دریافت یک محصول با وضعیت بوکمارک برای کاربر خاص
  @Get(':productId/with-bookmark-status')
  async findOneWithBookmarkStatus(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('userId', ParseIntPipe) userId: number,
    @Res() res: express.Response,
  ) {
    const product = await this.productsService.findOneWithBookmarkStatus(productId, userId);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: product,
      message: 'محصول با وضعیت بوکمارک با موفقیت دریافت شد',
    });
  }


}