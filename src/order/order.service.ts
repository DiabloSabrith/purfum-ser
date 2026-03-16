import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'entity/Order.entity';
import { Product } from 'entity/Product.entity';
import { User } from 'entity/User.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  // ⭐ Публичный метод для создания заказа с объектами Product и User
  async createOrderWithEntities(params: {
    telegramId?: number;
    userId?: number;
    name: string;
    city: string;
    delivery: string;
    quantity: number;
    product: Product;
    user?: User;
  }) {
    const { telegramId, userId, name, city, delivery, quantity, product, user } = params;

    const orderData: DeepPartial<Order> = {
      telegramId,
      userId,
      name,
      city,
      delivery,
      quantity,
      status: 'Оформлен',
      product,              // передаём объект, а не id
      user: user ?? undefined, // если null → undefined
    };

    const order = this.orderRepo.create(orderData);
    return this.orderRepo.save(order);
  }

  // ✅ Существующий метод для создания заказа по id (можно оставить)
  async createOrder(params: {
    telegramId?: number;
    userId?: number;
    name: string;
    city: string;
    delivery: string;
    productId?: number;
    quantity: number;
  }) {
    const { telegramId, userId, name, city, delivery, productId, quantity } = params;

    const product = productId
      ? await this.orderRepo.manager.findOne(Product, { where: { id: productId } })
      : undefined;

    const user = userId
      ? await this.orderRepo.manager.findOne(User, { where: { id: userId } })
      : undefined;

    const orderData: DeepPartial<Order> = {
      telegramId,
      userId,
      name,
      city,
      delivery,
      status: 'Оформлен',
      quantity,
      product: product ?? undefined,
      user: user ?? undefined,
    };

    const order = this.orderRepo.create(orderData);
    return this.orderRepo.save(order);
  }

  async getOrdersByTelegramId(telegramId: number, relations: string[] = []) {
    return this.orderRepo.find({
      where: { telegramId },
      relations,
      order: { createdAt: 'DESC' },
    });
  }

  async getOrdersByUserId(userId: number, relations: string[] = []) {
    return this.orderRepo.find({
      where: { userId },
      relations,
      order: { createdAt: 'DESC' },
    });
  }

  async getAllOrders() {
    return this.orderRepo.find({
      relations: ['product', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(orderId: number, status: Order['status']) {
    return this.orderRepo.update(orderId, { status });
  }
}
