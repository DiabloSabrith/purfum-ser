import { Body, Controller, Post } from '@nestjs/common'
import { PaymentService } from './payment.service'

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

@Post('create')
async createPayment(@Body() body: { amount: number }) {
  if (!body.amount || body.amount <= 0) {
    throw new Error('Некорректная сумма для платежа');
  }

  const paymentAmount = {
    value: body.amount.toFixed(2), // превращаем число в строку "123.00"
    currency: 'RUB' as const,
  };

  const payment = await this.paymentService.createPayment(
    paymentAmount,
    'Оплата заказа',
  );

  return {
    url: payment.confirmation.confirmation_url,
    paymentId: payment.id,
  };
}
}
