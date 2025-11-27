export interface ICart{
    _id: string;
    user: string;
    product: string;
    category: string;
    price: number;
    quantity: number;
    total: number;
    coupon: string;
    createdAt: Date;
    updatedAt: Date; 
};

export interface CartResponse {
   _id: string;
    user: string;
    product: string;
    category: string;
    price: number;
    quantity: number;
    total: number;
    coupon: string;
    createdAt: Date;
    updatedAt: Date; 
};

export interface AddCartRequest{
    _id: string;
    user: string;
    product: string;
    category: string;
    price: number;
    quantity: number;
    total: number;
    coupon: string;
    createdAd: Date;
    updatedAt: Date;
};

// required from order module : 
// Interface for populated cart (when product is populated)
export interface ICartPopulated extends Omit<ICart, 'product' | 'category'> {
    product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
        stock: number;
    };
    category: {
        _id: string;
        name: string;
    };
};