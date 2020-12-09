import * as mongoose from 'mongoose';

export const OrdersSchema = new mongoose.Schema({
  cart: { type: Array, required: true },
  UserId: { type: String, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'DELIVERED'],
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'STRIPE'],
  },
  totalBill: {
    type: Number,
    required: true,
  },
});

export interface Orders {
  cart: [];
  UserId: string;
  status: string;
  paymentMethod: string;
  totalBill: number;
}
