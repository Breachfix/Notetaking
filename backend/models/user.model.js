import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: 'https://res.cloudinary.com/dizzydanny/image/upload/v1630479863/default_user_icon_e0g34t.png',
  },
  otp: String,
  otpExpires: Date, // Add fields for OTP and its expiration time
});

const User = mongoose.model('User', userSchema);

export default User;
