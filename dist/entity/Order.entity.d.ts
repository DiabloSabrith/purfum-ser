import { Product } from './Product.entity';
import { User } from './User.entity';
export type OrderStatus = 'Оформлен' | 'В пути' | 'В пункте выдачи' | 'Отменен';
export declare class Order {
    id: number;
    telegramId?: number;
    userId?: number;
    name: string;
    city: string;
    delivery: string;
    status: OrderStatus;
    quantity: number;
    product?: Product;
    user?: User;
    createdAt: Date;
    updatedAt: Date;
}
