import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

/* eslint-disable no-unused-vars */
export interface TUser {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
  passwordChangedAt: Date;
}
export type TNewUser = Partial<TUser>;

export interface UserModel extends Model<TUser> {
  //instance methods
  isUserExistsByCustomId(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isUserBlocked(id: string): Promise<boolean>;
  isUserDeleted(id: string): Promise<boolean>;
  isPasswordChangedAfterJWTissued(
    passwordChangedAt: Date,
    jwtIssuedAt: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
