//  {} ? [] 0

import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';

const loginUser = async (payload: TLoginUser) => {
  const { id, password } = payload;
  const user = await User.isUserExistsByCustomId(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (await User.isUserBlocked(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is blocked');
  }

  if (await User.isUserDeleted(id)) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is deleted');
  }

  if (!(await User.isPasswordMatched(password, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Wrong password!');
  }

  return {};
};

export const AuthServices = { loginUser };
