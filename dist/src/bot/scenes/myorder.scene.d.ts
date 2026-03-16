import { OrderService } from "src/order/order.service";
export declare class MyOrdersScene {
    private readonly orderService;
    private readonly logger;
    constructor(orderService: OrderService);
    showOrders(ctx: any): Promise<any>;
}
