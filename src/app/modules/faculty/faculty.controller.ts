import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { FacultyServices } from './faculty.service';

const getAllFaculties = catchAsync(async (req, res) => {
  const query = req.query;
  // console.log(query);
  const result = await FacultyServices.getAllFacultiesFromDB(query);

  sendResponse(res, {
    success: true,
    message: 'Faculties retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const getSingleFaculty = catchAsync(async (req, res) => {
  const { facultyID } = req.params;
  const result = await FacultyServices.getSingleFacultyFromDB(facultyID);
  sendResponse(res, {
    success: true,
    message: 'Faculty retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const updateFaculty = catchAsync(async (req, res) => {
  const { facultyID } = req.params;
  const { faculty: updateData } = req.body;
  const result = await FacultyServices.updateFacultyIntoDB(
    facultyID,
    updateData,
  );
  sendResponse(res, {
    success: true,
    message: 'Faculty updated successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
  const { facultyID } = req.params;
  const result = await FacultyServices.deleteFacultyFromDB(facultyID);
  sendResponse(res, {
    success: true,
    message: 'Faculty deleted successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const FacultyControllers = {
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
