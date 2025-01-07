import { Model } from 'mongoose';

/* eslint-disable no-unused-vars */
export interface TUser {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  //instance methods
  isUserExistsByCustomId(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isUserBlocked(id: string): Promise<boolean>;
  isUserDeleted(id: string): Promise<boolean>;
}

export type TNewUser = Partial<TUser>;
