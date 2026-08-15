// src/orders/entities/order-item.entity.ts
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;



    @ManyToOne(() => Order, (order) => order.items)
    @JoinColumn()
    order: Order;


    @ManyToOne(() => Product)
    @JoinColumn()
    product: Product;


    @Column()
    quantity: number;


    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}