import { CartItem } from 'entity/CartItem.entity';
import { Repository } from 'typeorm';
import { User } from 'entity/User.entity';
export declare class CartService {
    private readonly cartRepository;
    private readonly userRepository;
    constructor(cartRepository: Repository<CartItem>, userRepository: Repository<User>);
    getCartByUser(token: string): Promise<CartItem[]>;
    clearCart(token: string): Promise<void>;
    addToCart(token: string, productId: number, quantity?: number): Promise<CartItem>;
    removeFromCart(token: string, productId: number): Promise<{
        message: string;
    }>;
}
