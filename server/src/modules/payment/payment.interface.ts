export interface IPayment {
  _id: string;
  order: string; // Reference to Order
  user: string;  // Reference to User
  amount: number;
  currency: string;
  paymentMethod: 'credit_card' | 'paypal' | 'stripe' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paymentGateway: 'stripe' | 'paypal' | 'custom';
  gatewayResponse?: any; // Raw response from payment gateway
  createdAt: Date;
  updatedAt: Date;
}