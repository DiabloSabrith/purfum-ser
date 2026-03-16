import { OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CatalogScene } from "./scenes/catalog.scene";
import { PromoScene } from "./scenes/promo.scene";
import { CartScene } from "./scenes/cart.scene";
import { HelpScene } from "./scenes/help.scene";
import { AuthScene } from "./scenes/auth.scene";
import { OrderScene } from "./scenes/order.scene";
import { MyOrdersScene } from "./scenes/myorder.scene";
export declare class BotService implements OnModuleInit {
    private readonly configService;
    private readonly authScene;
    private readonly catalogScene;
    private readonly cartScene;
    private readonly promoScene;
    private readonly helpScene;
    private readonly orderScene;
    private readonly myOrdersScene;
    private bot?;
    private readonly logger;
    constructor(configService: ConfigService, authScene: AuthScene, catalogScene: CatalogScene, cartScene: CartScene, promoScene: PromoScene, helpScene: HelpScene, orderScene: OrderScene, myOrdersScene: MyOrdersScene);
    onModuleInit(): Promise<void>;
}
