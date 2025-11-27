import { Document } from 'mongoose';

export interface IProduct extends Document{
    _id: string; 
    name: string;
    category: string;
    vendor: string;
    price: number;
    originalPrice: number;
    stock: number;
    productImg: string;
    description: string;
    color: string;
    status: 'LIST' | 'UNLIST'
    createdAt: Date;
    updatedAt: Date;
};

export interface ProductResponse {
  _id: string;
  name: string;
  category: string;
  vendor: string ;
  
  productImg: string;
  price: number;
  originalPrice: number;
  stock: number;
  color: string;
  status: string;
  description: string ;
  
  createdAt: Date;
  updatedAt: Date;
};

export interface AddProductRequest{
  name: string;
  category: string;
 vendor?: string; // Make optional
  productImg?: string;
  price: number;
  originalPrice: number;
  stock: number;
  color: string;
  description: string ;
  brand?: string;
  model?: string;
};