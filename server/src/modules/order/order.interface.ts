export interface IOrder {
  _id: string;
  user: string;
  items: {
    product: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}