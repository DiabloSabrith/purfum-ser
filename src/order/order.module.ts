import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { Order } from 'entity/Order.entity';
import { OrderController } from './order.controller';
import { PaymentModule } from 'src/payment/payment.module';




@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    PaymentModule // <- добавляем репозиторий
  ],
  controllers: [OrderController], // если OrderController не нужен, можно оставить пустым
  providers: [
    OrderService,

  ],
  exports: [
    OrderService,
  
  ],

})
export class OrderModule {}
