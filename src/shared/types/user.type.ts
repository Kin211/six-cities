import {UserType} from './user-type.type.js';

export type User = {
  name: string;
  email: string;
  avatarPath: string;
  password: string;
  userType: UserType;
};
