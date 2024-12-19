import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { AcademicSemesterServices } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  const academicSemester = req.body;
  const result =
    await AcademicSemesterServices.createAcademicSemesterToDb(academicSemester);
  sendResponse(res, {
    success: true,
    message: ' Academic Semester created successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const AcademicSemesterController = {
  createAcademicSemester,
};
