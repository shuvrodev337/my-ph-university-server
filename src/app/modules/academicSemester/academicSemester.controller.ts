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
    message: 'Academic Semester created successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});

const getAllAcademicSemesters = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllAcademicSemestersFromDb(
    req.query,
  );
  sendResponse(res, {
    success: true,
    message: 'Academic Semesters retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result.result,
    meta: result.meta,
  });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result =
    await AcademicSemesterServices.getSingleAcademicSemesterFromDb(semesterId);
  sendResponse(res, {
    success: true,
    message: 'Academic Semester retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const updateAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const payload = req.body;
  const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(
    semesterId,
    payload,
  );
  sendResponse(res, {
    success: true,
    message: 'Academic Semester retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const AcademicSemesterController = {
  createAcademicSemester,
  getAllAcademicSemesters,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
