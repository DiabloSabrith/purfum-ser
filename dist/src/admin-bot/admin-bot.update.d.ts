import { AdminBotService } from './admin-bot.service';
import { AdminBotGuard } from './admin-bot.guard';
import { ProductApi } from './api/product.api';
import { OrderService } from 'src/order/order.service';
export declare class AdminBotUpdate {
    private readonly botService;
    private readonly adminGuard;
    private readonly productApi;
    private readonly orderService;
    private sessions;
    constructor(botService: AdminBotService, adminGuard: AdminBotGuard, productApi: ProductApi, orderService: OrderService);
    private handleStart;
    private handleCreateProduct;
    private handleCreateGender;
    private notifyOrderStatus;
    private renderProductWithActions;
    private handleEditProduct;
    private handleEditSelect;
    private handleDeleteProduct;
    private handleDeleteConfirm;
    private handleDeleteExecute;
    private handleCancel;
    private handleGetOrders;
    private handleChangeOrderStatus;
    private handleSetOrderStatus;
    private handleText;
}
