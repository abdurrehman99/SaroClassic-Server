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
