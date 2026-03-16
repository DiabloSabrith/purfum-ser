export type PaymentAmount = {
    value: string;
    currency: 'RUB';
};
export declare class PaymentService {
    private yooKassa;
    constructor();
    createPayment(amount: PaymentAmount, description: string): Promise<any>;
}
