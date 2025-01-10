import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);

  const { refreshToken, accessToken, needsPasswordChange } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
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
const refreshToken = catchAsync(async (req, res) => {
  // browser sends the cookies automatically
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
export const AuthControllers = { loginUser, changePassword, refreshToken };
