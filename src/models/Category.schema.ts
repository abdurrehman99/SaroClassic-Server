import * as mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export interface Category {
  email: string;
}
