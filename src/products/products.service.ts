import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { BookmarkProduct } from './entities/product-bookmark.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(BookmarkProduct)
    private readonly bookmarkRepository: Repository<BookmarkProduct>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly userService: UserService,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { title, price, description, stock, categoryIds } = createProductDto

    const product = await this.productRepository.create({ title, price, description, stock })

    if (categoryIds) {
      const categories = await this.categoryRepository.findBy({ id: In(categoryIds) })
      product.categories = categories
    }

    return await this.productRepository.save(product)
  }

  async findAll() {
    return await this.productRepository.find({ relations: { 'categories': true } })
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id }, relations: { 'categories': true } })

    if (!product) throw new NotFoundException('محصول موردنظر یافت نشد')

    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { title, price, description, stock, categoryIds } = updateProductDto

    const product = await this.findOne(id)

    if (title) product.title = title
    if (price) product.price = price
    if (description) product.description = description
    if (stock) product.stock = stock

    if (categoryIds) {
      const categories = await this.categoryRepository.findBy({ id: In(categoryIds) })
      product.categories = categories
    }

    return await this.productRepository.save(product)
  }

  async remove(id: number): Promise<{ message: string }> {
    const product = await this.findOne(id);

    // حذف بوکمارک‌های مربوط به این محصول
    await this.bookmarkRepository.delete({
      productId: product.id,
    });

    await this.productRepository.remove(product);
    return { message: 'محصول با موفقیت حذف شد' };
  }

  // =============== متدهای بوکمارک ===============

  // تگل بوکمارک (ثبت یا حذف)
  async toggleBookmark(productId: number, userId: number): Promise<{ message: string; isBookmarked: boolean }> {
    // بررسی وجود محصول
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('محصول مورد نظر یافت نشد');
    }

    // بررسی وجود کاربر
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('کاربر مورد نظر یافت نشد');
    }

    // بررسی وجود بوکمارک
    const existingBookmark = await this.bookmarkRepository.findOne({
      where: {
        productId: productId,
        userId: userId,
      },
    });

    if (existingBookmark) {
      await this.bookmarkRepository.remove(existingBookmark);
      return {
        message: 'بوکمارک با موفقیت حذف شد',
        isBookmarked: false,
      };
    } else {
      const newBookmark = this.bookmarkRepository.create({
        productId: productId,
        userId: userId,
      });
      await this.bookmarkRepository.save(newBookmark);
      return {
        message: 'بوکمارک با موفقیت ثبت شد',
        isBookmarked: true,
      };
    }
  }

  // بررسی وضعیت بوکمارک
  async checkBookmarkStatus(productId: number, userId: number): Promise<boolean> {
    const bookmark = await this.bookmarkRepository.findOne({
      where: {
        productId: productId,
        userId: userId,
      },
    });
    return !!bookmark;
  }

  // دریافت لیست بوکمارک‌های یک کاربر
  async getUserBookmarks(userId: number): Promise<Product[]> {
    const bookmarks = await this.bookmarkRepository.find({
      where: { userId: userId },
      relations: {
        product: {
          categories: true
        }
      },
    });

    return bookmarks.map(bookmark => bookmark.product);
  }

  // دریافت تعداد بوکمارک‌های یک محصول
  async getProductBookmarksCount(productId: number): Promise<number> {
    return await this.bookmarkRepository.count({
      where: { productId: productId },
    });
  }

  // دریافت لیست محصولات با وضعیت بوکمارک
  async getProductsWithBookmarkStatus(userId: number): Promise<any[]> {
    const products = await this.productRepository.find({
      relations: { categories: true }
    });

    const bookmarks = await this.bookmarkRepository.find({
      where: { userId: userId },
      select: { productId: true },
    });

    const bookmarkedProductIds = bookmarks.map(bookmark => bookmark.productId);

    return products.map(product => ({
      ...product,
      isBookmarked: bookmarkedProductIds.includes(product.id),
    }));
  }

  // دریافت یک محصول با وضعیت بوکمارک
  async findOneWithBookmarkStatus(productId: number, userId: number): Promise<any> {
    const product = await this.findOne(productId);
    const isBookmarked = await this.checkBookmarkStatus(productId, userId);
    const bookmarkCount = await this.getProductBookmarksCount(productId);

    return {
      ...product,
      isBookmarked,
      bookmarkCount,
    };
  }



  // حذف بوکمارک‌های یک محصول
  async deleteProductBookmarks(productId: number): Promise<void> {
    await this.bookmarkRepository.delete({
      productId: productId,
    });
  }

  // حذف بوکمارک‌های یک کاربر
  async deleteUserBookmarks(userId: number): Promise<void> {
    await this.bookmarkRepository.delete({
      userId: userId,
    });
  }

  // ------------------ cart functions ------------------//

  async addItemToBasket(userId: number, productId: number) {
    const product = await this.productRepository.findOne({ where: { id: productId } })

    return await this.userService.addProductToBasket(userId, product)


  }


  async removeItemFromBasket(userId: number, productId: number) {
    // پیدا کردن محصول برای برگرداندن اطلاعات
    const product = await this.productRepository.findOne({
      where: { id: productId }
    });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }

    // حذف از سبد خرید
    const result = await this.userService.removeProductFromBasket(userId, productId);

    // برگرداندن نتیجه به همراه اطلاعات محصول
    return {
      message: 'محصول با موفقیت از سبد خرید حذف شد',
      product: product,
      result: result
    };
  }
}