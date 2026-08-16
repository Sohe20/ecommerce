import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { UserService } from '../user/user.service';
import { AddressService } from '../address/address.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './enums/order-status.enum';
import { ProductsService } from 'src/products/products.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly productService: ProductsService,
    private readonly userService: UserService,
    private readonly addressService: AddressService,
    private readonly dataSource: DataSource,
    private readonly httpService: HttpService

  ) { }

  async create(createOrderDto: CreateOrderDto) {
    // get user
    const user = await this.userService.findOne(createOrderDto.userId);
    if (!user) {
      throw new NotFoundException('کاربر مورد نظر یافت نشد');
    }

    // get address
    const address = await this.addressService.findOne(createOrderDto.addressId);
    if (!address) {
      throw new NotFoundException('آدرس مورد نظر یافت نشد');
    }

    // create temp order
    const order = this.orderRepository.create({
      user,
      address,
      discountCode: createOrderDto.discountCode,
      status: createOrderDto.status || OrderStatus.PENDING,
    });

    const saveOrder = await this.orderRepository.save(order)

    // asign order items to order
    let totalPrice = 0
    if (createOrderDto.items && createOrderDto.items.length > 0) {
      const orderItems = createOrderDto.items.map(async (item) => {
        const product = await this.productService.findOne(item.productId)
        totalPrice += product.price


        const orderItem = await this.orderItemRepository.create({
          order: saveOrder,
          product,
          quantity: item.quantity,
        })

        return this.orderItemRepository.save(orderItem)
      })

      await Promise.all(orderItems)
    }
    // update total price in order
    await this.orderRepository.update({ id: saveOrder.id }, { totalPrice: totalPrice })

    const returned_order = this.orderRepository.findOne({
      where: { id: saveOrder.id },
      relations: {
        user: true,
        address: true,
        items: { product: true },
      },
    });

    return returned_order
  }

  findAll() {
    return this.orderRepository.find({
      relations: { user: true, address: true, items: { product: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { user: true, address: true, items: { product: true } },
    });

    if (!order) {
      throw new NotFoundException(`سفارش با شناسه ${id} یافت نشد`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
      if (
        updateOrderDto.status === OrderStatus.COMPLETED &&
        !order.payedTime
      ) {
        order.payedTime = new Date();
      }
    }

    if (updateOrderDto.addressId) {
      const address = await this.addressService.findOne(updateOrderDto.addressId);
      if (!address) {
        throw new NotFoundException('آدرس مورد نظر یافت نشد');
      }
      order.address = address;
    }

    // if (updateOrderDto.totalPrice !== undefined) {
    //   order.totalPrice = updateOrderDto.totalPrice;
    // }

    if (updateOrderDto.discountCode !== undefined) {
      order.discountCode = updateOrderDto.discountCode;
    }

    await this.orderRepository.save(order);
    return this.findOne(id);
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
    return { message: 'سفارش با موفقیت حذف شد' };
  }


  async startPayment(order_id: number) {
    const order = await this.findOne(order_id)
    const request = await this.httpService.post("https://gateway.zibal.ir/v1/request",
      { merchant: 'zibal', amount: (order.totalPrice * 10) , callbackUrl:'https://localhost'})

    const responseBody = await lastValueFrom(request)

    return responseBody.data

  }


  async verifyPayment(trackId: number , order_id : number) {
    const request = this.httpService.post("https://gateway.zibal.ir/v1/verify/",
      { merchant: 'zibal', trackId : trackId})

    const responseBody = await lastValueFrom(request)

    if(responseBody.data.result === 100){
      const order = await this.findOne(order_id)
      order.status = OrderStatus.COMPLETED
      await this.orderRepository.save(order)
    }


    return responseBody.data

  }
}