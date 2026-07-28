import { IsArray, IsInt, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
    @IsString({message:'نام محصول باید یک رشته باشد'})
    @IsOptional()
    title:string

    @IsInt()
    @IsOptional()
    price:number

    @IsString({message:'توضیحات محصول باید یک رشته باشد'})
    @IsOptional()
    description:string

    @IsInt()
    @IsOptional()
    stock:number

    @IsOptional()
    @IsArray()
    categoryIds?:number[]

}
