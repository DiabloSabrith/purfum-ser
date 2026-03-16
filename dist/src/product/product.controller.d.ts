import { ProductService } from './product.service';
import { Product } from 'entity/Product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getAll(): Promise<Product[]>;
    searchProducts(name?: string, minPrice?: string, maxPrice?: string, gender?: 'male' | 'female'): Promise<Product[]>;
    getPaginated(page?: string, limit?: string, excludeGender?: 'male' | 'female'): Promise<{
        items: Product[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getOne(id: number): Promise<Product>;
    createProduct(payload: CreateProductDto): Promise<Product>;
    updateProduct(id: number, payload: UpdateProductDto): Promise<Product>;
    deleteProduct(id: number): Promise<{
        message: string;
    }>;
}
