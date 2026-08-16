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
  ParseIntPipe,
} from '@nestjs/common';
import express from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaymentOrderDto } from './dto/payment-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Res() res: express.Response,
  ) {
    const order = await this.ordersService.create(createOrderDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: order,
      message: 'سفارش موردنظر با موفقیت ثبت شد',
    });
  }

  @Get()
  async findAll(@Res() res: express.Response) {
    const orders = await this.ordersService.findAll();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: orders,
      message: 'لیست سفارش‌ها با موفقیت دریافت شد',
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: express.Response,
  ) {
    const order = await this.ordersService.findOne(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: order,
      message: 'سفارش موردنظر با موفقیت دریافت شد',
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Res() res: express.Response,
  ) {
    const order = await this.ordersService.update(id, updateOrderDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: order,
      message: 'سفارش موردنظر با موفقیت بروزرسانی شد',
    });
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: express.Response,
  ) {
    const result = await this.ordersService.remove(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: result,
      message: 'سفارش موردنظر با موفقیت حذف شد',
    });
  }

  @Post('/start-payment/')
  async startPayment(@Body() paymentOrderDto: PaymentOrderDto, @Res() res: express.Response) {
    const responsePay = await this.ordersService.startPayment(paymentOrderDto.order_id)

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: { ...responsePay, payment_url: `https://gateway.zibal.ir/start/${responsePay.trackId}` },
      message: 'لینک پرداخت با موفقیت ساخته شد',
    });

  }


  @Post('/verify-payment/')
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto, @Res() res: express.Response) {
    const responsePay = await this.ordersService.verifyPayment(verifyPaymentDto.trackId , verifyPaymentDto.order_id)

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: responsePay,
      message: 'تراکنش با موفقیت پردازش شد',
    });

  }

}