import { forwardRef, Module } from '@nestjs/common';
import { BotService } from './bot.service';

import { ConfigModule } from '@nestjs/config';



import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { CartModule } from '../cart/cart.module';
import { PromoModule } from '../promo/promo.module';
import { AuthScene } from './scenes/auth.scene';
import { CatalogScene } from './scenes/catalog.scene';
import { CartScene } from './scenes/cart.scene';
import { PromoScene } from './scenes/promo.scene';
import { TgAuthGuard } from './guards/auth.guard';
import { HelpScene } from './scenes/help.scene';
import { AuthModule } from 'src/auth/auth.module';
import { OrderScene } from './scenes/order.scene';
import { OrderModule } from 'src/order/order.module';
import { MyOrdersScene } from './scenes/myorder.scene';

@Module({
  imports: [
    ConfigModule,

    // бизнес-модули
    UserModule,
    AuthModule,
    ProductModule,
    CartModule,
    PromoModule,
    OrderModule,
    
    
  ],
  providers: [
    BotService,

    // сцены
    AuthScene,
    CatalogScene,
    CartScene,
    PromoScene,
     HelpScene,
     OrderScene,
 MyOrdersScene,
    // гард
    TgAuthGuard,
    
  ],

})
export class BotModule {}
