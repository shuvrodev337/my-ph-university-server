import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { AcademicDepartmentServices } from './academicDepartment.service';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const academicDepartment = req.body;
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDb(
      academicDepartment,
    );
  sendResponse(res, {
    success: true,
    message: 'Academic department created successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const getAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getAcademicDepartmentsFromDb();
  sendResponse(res, {
    success: true,
    message: 'Academic departments retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { academicDepartmentId } = req.params;
  const result =
    await AcademicDepartmentServices.getSingleAcademicDepartmentFromDb(
      academicDepartmentId,
    );
  sendResponse(res, {
    success: true,
    message: 'Academic department retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const updateAcademicDepartment = catchAsync(async (req, res) => {
  const { academicDepartmentId } = req.params;
  const academicDepartment = req.body;
  const result =
    await AcademicDepartmentServices.updateAcademicDepartmentIntoDb(
      academicDepartmentId,
      academicDepartment,
    );
  sendResponse(res, {
    success: true,
    message: 'Academic department updated successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});

export const AcademicDepartmentController = {
  createAcademicDepartment,
  getAcademicDepartments,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
