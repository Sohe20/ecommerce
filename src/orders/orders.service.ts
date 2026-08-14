import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { UserService } from '../user/user.service';
import { AddressService } from '../address/address.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly userService: UserService,
    private readonly addressService: AddressService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, addressId, items, totalPrice, discountCode, status, payedTime } =
      createOrderDto;

    // فرض کردم UserService.findOne و AddressService.findOne یا entity رو برمی‌گردونن
    // یا خودشون در صورت نبود، NotFoundException پرتاب می‌کنن (پترن استاندارد Nest CLI)
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('کاربر مورد نظر یافت نشد');
    }

    const address = await this.addressService.findOne(addressId);
    if (!address) {
      throw new NotFoundException('آدرس مورد نظر یافت نشد');
    }

    const productIds = items.map((item) => item.productId);
    const products = await this.productRepository.findBy({
      id: In(productIds),
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('برخی از محصولات یافت نشدند');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = queryRunner.manager.create(Order, {
        user,
        address,
        totalPrice,
        discountCode: discountCode ?? null,
        status: status ?? OrderStatus.PENDING,
        payedTime: payedTime ?? null,
      });
      const savedOrder = await queryRunner.manager.save(order);

      const orderItems = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return queryRunner.manager.create(OrderItem, {
          order: savedOrder,
          product,
          quantity: item.quantity,
        });
      });
      await queryRunner.manager.save(orderItems);

      await queryRunner.commitTransaction();
      return this.findOne(savedOrder.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.orderRepository.find({
      relations: { user: true, address: true, orderItems: { product: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { user: true, address: true, orderItems: { product: true } },
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

    if (updateOrderDto.totalPrice !== undefined) {
      order.totalPrice = updateOrderDto.totalPrice;
    }

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
}