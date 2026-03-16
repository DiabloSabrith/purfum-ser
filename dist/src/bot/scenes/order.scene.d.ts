import { Telegraf } from 'telegraf';
import { OrderService } from 'src/order/order.service';
import { Product } from 'entity/Product.entity';
export declare class OrderScene {
    private readonly orderService;
    private readonly logger;
    private userState;
    constructor(orderService: OrderService);
    startOrder(ctx: any, product?: Product): Promise<void>;
    register(bot: Telegraf): void;
}
