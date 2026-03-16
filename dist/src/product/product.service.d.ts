import { Repository } from 'typeorm';
import { Product } from 'entity/Product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ConfigService } from '@nestjs/config';
export declare class ProductService {
    private readonly productRepository;
    private readonly configService;
    constructor(productRepository: Repository<Product>, configService: ConfigService);
    getProducts(): Promise<Product[]>;
    getProductById(productId: number): Promise<Product>;
    getProductsPaginated(page?: number, limit?: number, excludeGender?: 'male' | 'female'): Promise<{
        items: Product[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    uploadFromUrl(imageUrl: string): Promise<string>;
    createProduct(dto: CreateProductDto): Promise<Product>;
    updateProduct(id: number, dto: UpdateProductDto): Promise<Product>;
    deleteProduct(id: number): Promise<void>;
    searchProducts(filters: {
        name?: string;
        minPrice?: number;
        maxPrice?: number;
        gender?: 'male' | 'female';
    }): Promise<Product[]>;
}
