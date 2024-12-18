import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;
  const result = await UserServices.createStudentIntoDB(password, student);
  sendResponse(res, {
    success: true,
    message: 'Student created successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const UserController = {
  createStudent,
};
