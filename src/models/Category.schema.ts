import * as mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  mainCategory: { type: String, required: true },
});

export interface Category {
  name: string;
  mainCategory: string;
}
