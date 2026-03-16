import { Telegraf } from 'telegraf';
import { AuthService } from 'src/auth/auth.service';
import { CartService } from 'src/cart/cart.service';
import { OrderScene } from './order.scene';
export declare class CartScene {
    private readonly authService;
    private readonly cartService;
    private readonly orderScene;
    private readonly logger;
    constructor(authService: AuthService, cartService: CartService, orderScene: OrderScene);
    register(bot: Telegraf): void;
}
