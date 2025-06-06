import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user.model';
import { IBook } from './book.model';

export interface IBorrow extends Document {
  user: IUser['_id'];
  book: IBook['_id'];
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  createdAt: Date;
  updatedAt: Date;
}

const borrowSchema = new Schema<IBorrow>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'returned'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// 索引
borrowSchema.index({ user: 1, book: 1, status: 1 });

export const Borrow = mongoose.model<IBorrow>('Borrow', borrowSchema); 