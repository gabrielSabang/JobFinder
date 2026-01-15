import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'


const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email'],
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    if (!this.password) {
      throw new Error('Password is required');
    }

    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;

    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.login = async function (email, password) {
  try {
    const user = await this.findOne( email )
    if (!user) {
      throw new Error('Invalid email')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error('Invalid password')
    }
    return user

  } catch (error) {
    throw new Error(error.message);
  }
}

const User = mongoose.model('User', UserSchema)
export default User