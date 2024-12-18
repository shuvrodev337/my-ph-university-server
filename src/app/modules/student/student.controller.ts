import { StudentServices } from './student.services';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB();

  sendResponse(res, {
    success: true,
    message: 'Students retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const getSingleStudent = catchAsync(async (req, res) => {
  const { studentID } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(studentID);
  sendResponse(res, {
    success: true,
    message: 'Student retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const updateSingleStudent = catchAsync(async (req, res) => {
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
});

const deleteSingleStudent = catchAsync(async (req, res) => {
  const { studentID } = req.params;
  const result = await StudentServices.deleteSingleStudentFromDB(studentID);
  sendResponse(res, {
    success: true,
    message: 'Students deleted successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  updateSingleStudent,
  deleteSingleStudent,
};
