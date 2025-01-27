import mongoose from 'mongoose';
import { BUDGET_PERIODS } from '@/lib/utils/budgetPeriodUtils';

const budgetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  limit: {
    type: Number,
    required: true
  },
  period: {
    type: String,
    enum: Object.values(BUDGET_PERIODS),
    default: BUDGET_PERIODS.MONTHLY
  }
}, {
  timestamps: true
});

const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
export default Budget;