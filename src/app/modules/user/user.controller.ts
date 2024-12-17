import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, student } = req.body;
    const result = await UserServices.createStudentIntoDB(password, student);

    sendResponse(res, {
      success: true,
      message: 'Student created successfully',
      sttatusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const UserController = {
  createStudent,
};
