import { Injectable } from '@nestjs/common'
import YooKassa from 'yookassa'
import { v4 as uuidv4 } from 'uuid'

export type PaymentAmount = {
  value: string
  currency: 'RUB'
}

@Injectable()
export class PaymentService {
  private yooKassa: YooKassa

  constructor() {
    this.yooKassa = new YooKassa({
      shopId: process.env.YOOKASSA_SHOP_ID!,
      secretKey: process.env.YOOKASSA_SECRET_KEY!,
    })
  }

  async createPayment(amount: PaymentAmount, description: string) {
    const payment = await this.yooKassa.createPayment(
      {
        amount, // 👈 ВАЖНО: без toFixed тут
        confirmation: {
          type: 'redirect',
          return_url: 'http://localhost:3000/successful',
        },
        capture: true,
        description,
      },
      uuidv4(),
    )

    return payment
  }
}
