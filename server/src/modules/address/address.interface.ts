export interface IAddress {
  _id: string;
  user: string;
  name: string;
  mobileNumber: string;
  street: string;
  city: string;
  district: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}