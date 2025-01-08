import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  sendResponse(res, {
    success: true,
    message: 'Login successfull',
    sttatusCode: StatusCodes.OK,
    data: result,
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

export const AuthControllers = { loginUser, changePassword };
