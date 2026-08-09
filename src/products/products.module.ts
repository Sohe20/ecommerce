import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';
import { BookmarkProduct } from './entities/product-bookmark.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Product , Category , BookmarkProduct, User])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
