export declare enum ProductGender {
    MALE = "male",
    FEMALE = "female",
    UNISEX = "unisex"
}
export declare class Product {
    id: number;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    count: number;
    gender: ProductGender;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
