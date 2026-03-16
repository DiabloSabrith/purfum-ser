import { HttpService } from '@nestjs/axios';
export declare class ProductApi {
    private readonly http;
    constructor(http: HttpService);
    getProducts(): Promise<any[]>;
    createProduct(payload: any): Promise<any>;
    updateProduct(id: number, payload: any): Promise<any>;
    deleteProduct(id: number): Promise<any>;
    getOrders(): Promise<any[]>;
    searchProducts(params: {
        name?: string;
        minPrice?: number;
        maxPrice?: number;
        gender?: string;
    }): Promise<any[]>;
}
