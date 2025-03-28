import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: false },
    address: { type: String, required: false },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'supervisor'], default: 'supervisor' },
  },
  { timestamps: true }
);

// Optional: Add a virtual field for full name
UserSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model('User', UserSchema);
export default User;