import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createPayment(body: {
        amount: number;
    }): Promise<{
        url: any;
        paymentId: any;
    }>;
}
