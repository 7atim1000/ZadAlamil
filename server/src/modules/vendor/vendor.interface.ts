import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  _id: string,
  name: string;
  email: string;
  password: string;
  phone: string;
  licenseNumber: string;
  companyName: string;
  livePhoto: string;
  status: 'active' | 'inactive' | 'suspended';
  action: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Add the custom method to the interface
  comparePassword(candidatePassword: string): Promise<boolean>;
}

 

export interface AddVendorRequest{
    name: string;
    email: string;
    phone: string;
    companyName: string;
    licenseNumber: string;
    // status: string;
    // action: boolean;
};

// for fetch Venders
export interface IVendorResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  companyName: string;
  livePhoto: string;
  status: 'active' | 'inactive' | 'suspended' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ONGOING'; // Include all possible statuses
  action: boolean;
  createdAt: Date;
  updatedAt: Date;
};