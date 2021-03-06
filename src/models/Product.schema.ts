import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mainCategory: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
  },
  images: {
    type: Array,
  },
  description: {
    type: String,
  },
  outOfStock: {
    type: Boolean,
  },
  price: {
    type: Number,
  },
  size: {
    type: String,
  },
  featured: {
    type: Boolean,
  },
  feedback: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback',
    },
  ],
});

export interface Product {
  name: string;
  category: string;
  mainCategory: string;
  quantity: number;
  images: [];
  description: string;
  outOfStock: boolean;
  price: number;
  size: string;
  feedback: string;
}
