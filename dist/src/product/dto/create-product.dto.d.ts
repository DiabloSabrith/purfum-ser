import { ProductGender } from 'entity/Product.entity';
export declare class CreateProductDto {
    name: string;
    description?: string;
    price: string;
    imageUrl?: string;
    count: number;
    gender: ProductGender;
}
