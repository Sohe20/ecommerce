// src/orders/entities/order.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Address } from '../../address/entities/address.entity';
import { OrderStatus } from '../enums/order-status.enum';




@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;


  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;


  @Column({ type: 'timestamp', name: 'payed_time', nullable: true })
  payedTime: Date;


  @ManyToOne(() => Address, (address) => address.orders)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column({ type: 'bigint', name: 'total_price' })
  totalPrice: number;

  @Column({ type: 'varchar', name: 'discount_code', nullable: true })
  discountCode: number | null;


  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}