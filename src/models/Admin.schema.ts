import * as mongoose from 'mongoose';

export const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export interface Admin {
  email: string;
  password: string;
}
