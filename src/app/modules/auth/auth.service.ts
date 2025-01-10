//  {} ? [] 0

import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';
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

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange, // when Admin creates an account for a faculty or student,
    // it will initially set default password.that is why we need to pass this property for this account when logged in.
    // then the user can know whether he needs password change or not.
  };
};

const refreshToken = async (refreshToken: string) => {
  // purpose of this service => when the access token validation is expired,
  //  regenerate a new access token with the refresh token,
  //  send the new access token.

  const decoded = jwt.verify(
    refreshToken,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

  const user = await User.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (await User.isUserBlocked(userId)) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is blocked');
  }

  if (await User.isUserDeleted(userId)) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is deleted');
  }

  if (
    user.passwordChangedAt &&
    User.isPasswordChangedAfterJWTissued(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(StatusCodes.FORBIDDEN, 'You are not authorized!');
  }

  // give back a new access token
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  passwordData: {
    oldPassword: string;
    newPassword: string;
  },
) => {
  // userData is from token, it has the id and role of the user.
  const user = await User.isUserExistsByCustomId(userData.userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (await User.isUserBlocked(userData.userId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is blocked');
  }

  if (await User.isUserDeleted(userData.userId)) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is deleted');
  }

  if (
    !(await User.isPasswordMatched(passwordData?.oldPassword, user?.password))
  ) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Incorrect old password!');
  }
  const hashedNewPassword = await bcrypt.hash(
    passwordData.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: user.id,
      role: user.role,
    },
    {
      password: hashedNewPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
  return null;
};

/*
 *** Flow of forget and reset password ***
 * if user forgot password, user will hit the forget-password route with his id/userId >
 * we validate the id, generate token, generate a url with the token, send to the user email to reset password
 * When user click that url from his email, Client side will get that token, send it via headers.authorizaion and his id and new Password
 * we then verify the token, run validations and set new password.
 */

const forgetPassword = async (userId: string) => {
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (await User.isUserBlocked(userId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is blocked');
  }

  if (await User.isUserDeleted(userId)) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is deleted');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken}`;

  sendEmail(user.email, resetUILink);
};

const resetPassword = async (
  token: string,
  payload: { id: string; newPassword: string },
) => {
  // checking if the given token is valid

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string, // always should be decoded by the secret that the token was signed in with.
  ) as JwtPayload;

  const { userId, role } = decoded;
  const { id, newPassword } = payload;

  // check id from payload and userId from token is  same or not
  if (userId !== id) {
    throw new AppError(StatusCodes.FORBIDDEN, 'You are forbidden!');
  }

  // check valid user or not

  const user = await User.isUserExistsByCustomId(id);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // check id from user and userId from token is  same or not (optional validation)

  if (user.id !== userId) {
    throw new AppError(StatusCodes.FORBIDDEN, 'You are forbidden!');
  }

  // check block and delete

  if (await User.isUserBlocked(userId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is blocked');
  }

  if (await User.isUserDeleted(userId)) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is deleted');
  }

  // hash new password from payload

  const hashedNewPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userId,
      role: role,
    },
    {
      password: hashedNewPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};

/*
how to generate random number for JWT_ACCESS_SECRET
open =>NODE in terminal
then =>require('crypto').randomBytes(32).toString('hex')
*/
