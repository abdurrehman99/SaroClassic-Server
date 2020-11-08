import * as mongoose from 'mongoose';

export const FeedbackSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: String, required: true },
});

export interface Feedback {
  text: string;
  userId: string;
}
