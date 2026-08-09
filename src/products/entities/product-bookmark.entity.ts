// product-bookmark.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Product } from './product.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('product_bookmark')
export class BookmarkProduct {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'product_id' })
  productId: number;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;

  @ManyToOne(() => Product, (product) => product.bookmarkProducts)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => User, (user) => user.bookmarkProducts)
  @JoinColumn({ name: 'user_id' })
  user: User;
}