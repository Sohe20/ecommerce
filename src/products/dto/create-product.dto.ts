import { IsArray, IsInt, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsString({message:'نام محصول باید یک رشته باشد'})
    title:string

    @IsInt()
    price:number

    @IsString({message:'توضیحات محصول باید یک رشته باشد'})
    description:string

    @IsInt()
    stock:number

    @IsOptional()
    @IsArray()
    categoryIds?:number[]

}
