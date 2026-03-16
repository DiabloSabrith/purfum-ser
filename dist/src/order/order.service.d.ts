import { Repository } from 'typeorm';
import { Order } from 'entity/Order.entity';
import { Product } from 'entity/Product.entity';
import { User } from 'entity/User.entity';
export declare class OrderService {
    private readonly orderRepo;
    constructor(orderRepo: Repository<Order>);
    createOrderWithEntities(params: {
        telegramId?: number;
        userId?: number;
        name: string;
        city: string;
        delivery: string;
        quantity: number;
        product: Product;
        user?: User;
    }): Promise<Order>;
    createOrder(params: {
        telegramId?: number;
        userId?: number;
        name: string;
        city: string;
        delivery: string;
        productId?: number;
        quantity: number;
    }): Promise<Order>;
    getOrdersByTelegramId(telegramId: number, relations?: string[]): Promise<Order[]>;
    getOrdersByUserId(userId: number, relations?: string[]): Promise<Order[]>;
    getAllOrders(): Promise<Order[]>;
    updateStatus(orderId: number, status: Order['status']): Promise<import("typeorm").UpdateResult>;
}
