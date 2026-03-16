import { OrderService } from './order.service';
import { PaymentService } from 'src/payment/payment.service';
export declare class OrderController {
    private readonly orderService;
    private readonly paymentService;
    constructor(orderService: OrderService, paymentService: PaymentService);
    getAllOrders(): Promise<import("../../entity/Order.entity").Order[]>;
    createOrderWithPayment(body: {
        userId?: number;
        telegramId?: number;
        name: string;
        city: string;
        delivery: string;
        promoCode?: string;
        items: {
            productId: number;
            quantity: number;
        }[];
    }): Promise<{
        orderId: number;
        paymentUrl: any;
    }>;
    getUserOrdersByUserId(userId: number): Promise<import("../../entity/Order.entity").Order[]>;
    getUserOrdersByTelegramId(telegramId: number): Promise<import("../../entity/Order.entity").Order[]>;
    cancelOrder(id: number): Promise<{
        message: string;
    }>;
}
