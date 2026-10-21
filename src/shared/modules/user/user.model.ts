import { Schema, Document, model } from 'mongoose';
import { User, USER_TYPES } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';


export interface UserDocument extends User, Document {
  createdAt: Date;
  updatedAt: Date;
  setPassword(password: string, salt: string): void;
  verifyPassword(password: string, salt: string): boolean;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 15,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Некорректный email адрес'],
  },
  avatarPath: {
    type: String,
    required: false,
    default: '',
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  userType: {
    type: String,
    required: true,
    enum: USER_TYPES,
  },
}, {
  timestamps: true,
  collection: 'users',
});

userSchema.methods.setPassword = function(password: string, salt: string): void {
  this.password = createSHA256(password, salt);
};

userSchema.methods.verifyPassword = function(password: string, salt: string): boolean {
  const hashPassword = createSHA256(password, salt);
  return hashPassword === this.password;
};

export const UserModel = model<UserDocument>('User', userSchema);
