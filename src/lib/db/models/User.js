import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password by default in queries
  },
}, {
  timestamps: true,
});

// Add method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Get the password field explicitly since it's not included by default
    const user = await this.constructor.findById(this._id).select('+password');
    return await bcrypt.compare(candidatePassword, user.password);
  } catch (error) {
    throw error;
  }
};

// Hash password before saving user document
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Delete model if it exists to prevent OverwriteModelError
mongoose.models = {};

export default mongoose.model('User', UserSchema);
