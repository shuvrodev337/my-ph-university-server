import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicFacaltyServices } from './academicFaculty.service';
import { StatusCodes } from 'http-status-codes';

const createAcademicFaculty = catchAsync(async (req, res) => {
  const academicFaculty = req.body;
  const result =
    await AcademicFacaltyServices.createAcademicFacultyIntoDb(academicFaculty);
  sendResponse(res, {
    success: true,
    message: 'Academic faculty created successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const getAllAcademicFaculties = catchAsync(async (req, res) => {
  const result = await AcademicFacaltyServices.getAllAcademicFacultiesFromDb(
    req.query,
  );
  sendResponse(res, {
    success: true,
    message: 'Academic faculties retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result.result,
    meta: result.meta,
  });
});
const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { academicFacultyId } = req.params;
  const result =
    await AcademicFacaltyServices.getSingleAcademicFacultyFromDb(
      academicFacultyId,
    );
  sendResponse(res, {
    success: true,
    message: 'Academic faculty retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const updateAcademicFaculty = catchAsync(async (req, res) => {
  const { academicFacultyId } = req.params;
  const academicFaculty = req.body;
  const result = await AcademicFacaltyServices.updateAcademicFacultyIntoDb(
    academicFacultyId,
    academicFaculty,
  );
  sendResponse(res, {
    success: true,
    message: 'Academic faculty updated successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});

export const AcademicFacultyController = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
};
