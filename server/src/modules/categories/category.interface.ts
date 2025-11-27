import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  _id: string;
  name: string;
  vendor: string;
  categoryImg: string;
  status: 'LIST' | 'UNLIST';
  sales: number; // Added sales field for frontend requirement
  createdAt: Date;
  updatedAt: Date;
};


export interface CategoryResponse {
  _id: string;
  name: string;
  vendor: string;
  categoryImg: string;
  status: 'LIST' | 'UNLIST';
  sales: number;
  createdAt: Date;
  updatedAt: Date;
}


export interface UpdateCategoryRequest{
    name: string;
    vendor: string;
    categoryImg: string;
}