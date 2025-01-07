//  {} ? [] 0

import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import jwt from 'jsonwebtoken';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import config from '../../config';

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

  const jwtPayload = {
    userId: user.id,
    role: user.role,
    // we will not sen sensitive data here, ex: password. we will send this payload, encrypted through accessToken
  };

  // create token and send to client
  const accessToken = jwt.sign(
    {
      data: jwtPayload,
    },
    config.jwt_access_secret as string, //  secret from from server, not going purely, going as encrypted
    { expiresIn: '10d' },
  );

  return {
    accessToken,
    needsPasswordChange: user?.needsPasswordChange, // when Admin creates an account for a faculty or student,
    // it will initially set default password.that is why we need to pass this property for this account when logged in.
    // then the user can know whether he needs password change or not.
  };
};

export const AuthServices = { loginUser };
/*
how to generate random number for JWT_ACCESS_SECRET
open =>NODE in terminal
then =>require('crypto').randomBytes(32).toString('hex')
*/
