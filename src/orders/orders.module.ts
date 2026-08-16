import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { UsersModule } from 'src/user/user.module';
import { AddressModule } from 'src/address/address.module';
import { ProductsModule } from 'src/products/products.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    UsersModule,
    AddressModule,
    ProductsModule,
    HttpModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}