import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './student.services';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();
    sendResponse(res, {
      success: true,
      message: 'Students retrieved successfully',
      sttatusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentID } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentID);
    sendResponse(res, {
      success: true,
      message: 'Student retrieved successfully',
      sttatusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const updateSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentID } = req.params;
    const { updatedStudent } = req.body;
    //  const validatedData = updateStudentSchema.parse(updatedStudent);
    const result = await StudentServices.updateSingleStudentFromDB(
      studentID,
      updatedStudent,
    );
    sendResponse(res, {
      success: true,
      message: 'Students updated successfully',
      sttatusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentID } = req.params;
    const result = await StudentServices.deleteSingleStudentFromDB(studentID);
    sendResponse(res, {
      success: true,
      message: 'Students deleted successfully',
      sttatusCode: StatusCodes.OK,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  updateSingleStudent,
  deleteSingleStudent,
};
