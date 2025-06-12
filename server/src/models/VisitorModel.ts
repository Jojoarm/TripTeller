import mongoose from 'mongoose';

export interface VisitorType {
  visitedAt: Date;
  ip?: string;
  userId?: mongoose.Types.ObjectId;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VisitorSchema = new mongoose.Schema(
  {
    ip: String,
    userAgent: String,
    visitedAt: { type: Date, default: Date.now },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true }
);

export const VisitorModel = mongoose.model('Visitor', VisitorSchema);
