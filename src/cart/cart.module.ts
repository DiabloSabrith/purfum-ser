import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartItem } from 'entity/CartItem.entity';
import { User } from 'entity/User.entity';
import { CartScene } from 'src/bot/scenes/cart.scene';
import { AuthModule } from 'src/auth/auth.module';
import { OrderScene } from 'src/bot/scenes/order.scene';
import { OrderService } from 'src/order/order.service';
import { OrderModule } from 'src/order/order.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem, User]),
    AuthModule,
    OrderModule, //👈 подключаем репозитории
  ],
  providers: [CartService, CartScene,OrderScene], // 👈 добавляем сцену, если нужна
  controllers: [CartController],
  exports: [CartService], // 👈 если CartService нужен в других модулях
})
export class CartModule {}
