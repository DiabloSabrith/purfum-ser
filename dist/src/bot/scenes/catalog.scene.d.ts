import { Telegraf } from 'telegraf';
import { AuthService } from 'src/auth/auth.service';
import { ProductService } from 'src/product/product.service';
import { CartService } from 'src/cart/cart.service';
export declare class CatalogScene {
    private readonly authService;
    private readonly productService;
    private readonly cartService;
    private readonly logger;
    constructor(authService: AuthService, productService: ProductService, cartService: CartService);
    register(bot: Telegraf): void;
}
