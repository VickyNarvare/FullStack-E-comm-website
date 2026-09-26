import mongoose from 'mongoose';
const userRegisterSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashPassword: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
});

const userRegisterModel = mongoose.model('users', userRegisterSchema);
export default userRegisterModel;
