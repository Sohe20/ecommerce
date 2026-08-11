import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository : Repository<Category>,

    @InjectRepository(Product)
    private readonly productRepository : Repository<Product>,
  ){}


 async create(createCategoryDto: CreateCategoryDto) : Promise<Category> {
    const newCategory = this.categoryRepository.create(createCategoryDto)

    return this.categoryRepository.save(newCategory)
  }

  async findAll() : Promise<Category[]>{
   return await this.categoryRepository.find({relations : {'products':true}})
  }


  async findOne(id: number)  {
    const category = await this.categoryRepository.findOne({where : {id} , relations :{'products':true}})

    if (!category) throw new NotFoundException(`دسته بندی ${id} پیدا نشد`);

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category : Category | null = await this.findOne(id);
    Object.assign(category!,updateCategoryDto);
    return this.categoryRepository.save(category!);
  }

  // async removeOnlyCategory(id: number) {
  //   const  category : Category | null = await this.findOne(id);
    
  //   // delete product related to this category
  //   category.products=[]
  //   await this.categoryRepository.save(category)

  //   // delete category
  //   await this.categoryRepository.delete(category)
  // }

  // async safeRemove(id:number) :Promise<void>{
  //   const  category : Category | null = await this.findOne(id);
  //   if(category.products.length > 0) throw new BadRequestException('این دسته بندی بیشتر از یک محصول دارد')

  //   await this.categoryRepository.delete(category)
  // }


  async remove(id : number) : Promise<void>{
    const  category : Category | null = await this.findOne(id);

     await this.productRepository.remove(category.products)
     await this.categoryRepository.remove(category)
  }
}
