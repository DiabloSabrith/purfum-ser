import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { PaymentService } from 'src/payment/payment.service';
import { Product } from 'entity/Product.entity';
import { User } from 'entity/User.entity';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get()
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Post('create-with-payment')
  async createOrderWithPayment(
    @Body()
    body: {
      userId?: number;
      telegramId?: number;
      name: string;
      city: string;
      delivery: string;
      promoCode?: string;
      items: { productId: number; quantity: number }[];
    },
  ) {
    // 1️⃣ Проверка корзины
    if (!body.items || body.items.length === 0) {
      throw new Error('Корзина пуста');
    }

    // 2️⃣ Берём первый товар и пользователя
    const firstItem = body.items[0];

    const productEntity = await this.orderService['orderRepo'].manager.findOne(Product, {
      where: { id: firstItem.productId },
    });
    if (!productEntity) throw new Error('Товар не найден');
let userEntity: User | undefined;
if (body.userId) {
  userEntity = (await this.orderService['orderRepo'].manager.findOne(User, {
    where: { id: body.userId },
  })) ?? undefined; // вот здесь
  if (!userEntity) throw new Error('Пользователь не найден');
}


    // 3️⃣ Создаём заказ через новый метод
    const order = await this.orderService.createOrderWithEntities({
      telegramId: body.telegramId,
      userId: body.userId,
      name: body.name,
      city: body.city,
      delivery: body.delivery,
      quantity: body.items.reduce((sum, i) => sum + i.quantity, 0),
      product: productEntity,
      user: userEntity,
    });

    // 4️⃣ Считаем сумму
    let totalAmount = 0;
    for (const item of body.items) {
      const product = await this.orderService['orderRepo'].manager.findOne(Product, {
        where: { id: item.productId },
      });
      if (!product) throw new Error(`Товар ${item.productId} не найден`);

      const price = Number(product.price);
      if (!Number.isFinite(price) || price <= 0)
        throw new Error(`Некорректная цена товара ${product.id}`);
      if (!Number.isFinite(item.quantity) || item.quantity <= 0)
        throw new Error(`Некорректное количество товара ${product.id}`);

      totalAmount += price * item.quantity;
    }

    if (!Number.isFinite(totalAmount) || totalAmount < 1)
      throw new Error(`Некорректная сумма платежа: ${totalAmount}`);

    // 5️⃣ Создаём платёж
    const paymentAmount = {
      value: totalAmount.toFixed(2),
      currency: 'RUB' as const,
    };
    const payment = await this.paymentService.createPayment(
      paymentAmount,
      `Оплата заказа №${order.id}`,
    );

    // 6️⃣ Ответ
    return {
      orderId: order.id,
      paymentUrl: payment.confirmation.confirmation_url,
    };
  }

  @Get('user/byUserId/:userId')
  async getUserOrdersByUserId(@Param('userId') userId: number) {
    return this.orderService.getOrdersByUserId(userId); // relations подтягиваются внутри сервиса
  }

  @Get('user/byTelegramId/:telegramId')
  async getUserOrdersByTelegramId(@Param('telegramId') telegramId: number) {
    return this.orderService.getOrdersByTelegramId(telegramId);
  }

  /* Эндпоинт отмена заказа */
  @Patch(':id/cancel')
async cancelOrder(@Param('id') id: number) {
  await this.orderService.updateStatus(id, 'Отменен');
  return { message: 'Заказ отменён' };
}
}
