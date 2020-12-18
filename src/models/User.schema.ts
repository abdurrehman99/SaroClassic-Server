import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
  },
  password: {
    type: String,
  },
  shippingAddress: {
    type: String,
  },
  resetPasswordCode: {
    type: String,
  },
  expiry: {
    type: Date,
  },
  typeOfCustomer: {
    type: String,
    enum: ['WALK-IN', 'LOGGED-IN'],
  },
  orders: {
    type: Array,
  },
});

export interface User {
  name: string;
  email: string;
  contact: string;
  passowrd: string;
  billingAddress: string;
  resetPasswordCode: string;
  expiry: Date;
  shippingAddress: string;
  typeOfCustomer: number;
  orders: [];
}
