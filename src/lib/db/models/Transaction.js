import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Please specify the transaction type'],
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: false
  }
}, {
  timestamps: true,
});

// Delete model if it exists to prevent OverwriteModelError
mongoose.models = {};

export default mongoose.model('Transaction', TransactionSchema);
