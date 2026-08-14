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
import { OrderItem } from './order-item.entity';




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
    payedTime: Date | null;


    @ManyToOne(() => Address, (address) => address.orders)
    @JoinColumn({ name: 'address_id' })
    address: Address;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    orderItems: OrderItem[];


    @Column({ type: 'bigint', name: 'total_price' })
    totalPrice: number;

    @Column({ type: 'varchar', name: 'discount_code', nullable: true })
    discountCode: string | null;


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}