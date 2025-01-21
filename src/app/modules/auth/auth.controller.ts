import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import config from '../../config';
import AppError from '../../errors/AppError';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);

  const { refreshToken, accessToken, needsPasswordChange } = result;
  // vercel/ netlify or any other free hosting services do not provide cookie policy, digitalocean /aws server good for paid options.

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none', // frontend and backend different domain
    maxAge: 1000 * 60 * 60 * 24 * 365, // refresh token expirity // 1 year here
  });

  sendResponse(res, {
    success: true,
    message: 'Login successfull',
    sttatusCode: StatusCodes.OK,
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  // browser sends the cookies automatically if there is any.
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);
  const { accessToken } = result;
  sendResponse(res, {
    success: true,
    message: 'Access token retrieved successfully.',
    sttatusCode: StatusCodes.OK,
    data: {
      accessToken,
    },
  });
});
const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  const passwordData = req.body;
  const result = await AuthServices.changePassword(user, passwordData);
  sendResponse(res, {
    success: true,
    message: 'Password updated successfully!',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const forgetPassword = catchAsync(async (req, res) => {
  const userId = req.body.id;
  const result = await AuthServices.forgetPassword(userId);
  sendResponse(res, {
    success: true,
    message: 'Reset link is generated successfully!',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const resetPassword = catchAsync(async (req, res) => {
  // This token was sent to the user email. In frontend, we will add mechanism to get it and send back to this route.

  const token = req.headers.authorization;
  // checking if the token is missing

  if (!token) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!');
  }

  const result = await AuthServices.resetPassword(token, req.body);
  sendResponse(res, {
    success: true,
    message: 'password reset successful',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
