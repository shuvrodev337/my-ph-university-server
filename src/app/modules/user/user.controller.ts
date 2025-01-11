import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;
  const result = await UserServices.createStudentIntoDB(
    req.file, // file can be accessed by req.file, thanks to multer
    password,
    student,
  );
  sendResponse(res, {
    success: true,
    message: 'Student created successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty } = req.body;
  const result = await UserServices.createFacultyIntoDB(password, faculty);
  sendResponse(res, {
    success: true,
    message: 'Faculty created successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const createAdmin = catchAsync(async (req, res) => {
  const { password, admin } = req.body;
  const result = await UserServices.createAdminIntoDB(password, admin);
  sendResponse(res, {
    success: true,
    message: 'Admin created successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;

  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    success: true,
    message: `${role} retrieved successfully`,
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    success: true,
    message: 'Status is updated successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const UserController = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
