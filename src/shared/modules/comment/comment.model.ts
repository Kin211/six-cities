import { Schema, Document, model, Types } from 'mongoose';

export interface CommentDocument extends Document {
  text: string;
  rating: number;
  postDate: Date;
  author: Types.ObjectId;
  offerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema({
  text: { type: String, required: true },
  rating: { type: Number, required: true },
  postDate: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  offerId: { type: Schema.Types.ObjectId, ref: 'Offer', required: true },
}, {
  timestamps: true,
  collection: 'comments',
});

export const CommentModel = model<CommentDocument>('Comment', commentSchema);
