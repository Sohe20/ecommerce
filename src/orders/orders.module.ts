import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Address } from 'src/address/entities/address.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Order,OrderItem,Product,User,Address])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
