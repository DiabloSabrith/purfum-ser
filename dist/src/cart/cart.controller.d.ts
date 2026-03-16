import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<import("../../entity/CartItem.entity").CartItem[]>;
    addToCart(req: any, body: {
        productId: number;
        quantity: number;
    }): Promise<import("../../entity/CartItem.entity").CartItem>;
    clearCart(req: any): Promise<void>;
    removeFromCart(req: any, productId: number): Promise<{
        message: string;
    }>;
}
