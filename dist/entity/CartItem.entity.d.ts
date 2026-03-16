import { User } from './User.entity';
import { Product } from './Product.entity';
export declare class CartItem {
    id: number;
    user: User;
    product: Product;
    quantity: number;
}
