import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { PaymentModule } from './payment/payment.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PromoModule } from './promo/promo.module';
import { AuthModule } from './auth/auth.module';
import { User } from 'entity/User.entity';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './bot/bot.module';
import { Product } from 'entity/Product.entity';
import { CartItem } from 'entity/CartItem.entity';
import { Order } from 'entity/Order.entity';
import { AdminBotModule } from './admin-bot/admin-bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
   TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1708',
  database: process.env.DB_NAME || 'tg_bot',
  ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false,
  entities: [User, Product, CartItem, Order],
  synchronize: true,
  logging: false,
}),
    UserModule,
    ProductModule,
    PaymentModule,
    CartModule,
    OrderModule,
    PromoModule,
    AuthModule,
    BotModule,
    AdminBotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}