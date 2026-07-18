import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  Put,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import express from 'express';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @Res() res: express.Response,
  ) {
    const address = await this.addressService.create(createAddressDto);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: address,
      message: 'آدرس جدید با موفقیت ساخته شد',
    });
  }

  @Get()
  async findAll(@Res() res: express.Response) {
    const addresses = await this.addressService.findAll();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: addresses,
      message: 'آدرس ها موفقیت دریافت می‌شوند',
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: express.Response) {
    const address = await this.addressService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: address,
      message: 'آدرس مورد نظر موفقیت دریافت شد',
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Res() res: express.Response,
  ) {
    const address = await this.addressService.update(+id, updateAddressDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: address,
      message: 'آدرس مورد نظر با موفقیت بروزرسان شد',
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: express.Response) {
    await this.addressService.remove(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'آدرس مورد نظر با موفقیت حذف شد',
    });
  }
}
