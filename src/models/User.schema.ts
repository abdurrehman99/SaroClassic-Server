import * as mongoose from 'mongoose';

export const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
  },
  passowrd: {
    type: String,
  },
  billingAddress: {
    type: String,
  },
  shippingAddress: {
    type: String,
  },
  typeOfCustomer: {
    type: String,
    enum: ['WALK-IN', 'LOGGED-IN'],
  },
  orders: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }],
  },
});

export interface User {
  name: string;
  email: string;
  contact: string;
  passowrd: string;
  billingAddress: string;
  shippingAddress: string;
  typeOfCustomer: number;
  orders: [];
}
