import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { CourseServices } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const course = req.body;
  // console.log(query);
  const result = await CourseServices.createCourseIntoDb(course);

  sendResponse(res, {
    success: true,
    message: 'Course created successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const getAllCourses = catchAsync(async (req, res) => {
  const query = req.query;
  // console.log(query);
  const result = await CourseServices.getAllCoursesFromDb(query);

  sendResponse(res, {
    success: true,
    message: 'Courses retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result.result,
    meta: result.meta,
  });
});
const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseFromDb(id);
  sendResponse(res, {
    success: true,
    message: 'Course retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { course: updateData } = req.body;

  const result = await CourseServices.updateCourseIntoDb(id, updateData);
  sendResponse(res, {
    success: true,
    message: 'Course updated successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromoDb(id);
  sendResponse(res, {
    success: true,
    message: 'Course deleted successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const assignFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.assignFacultiesWithCourseIntoDB(
    courseId,
    faculties,
  );
  sendResponse(res, {
    success: true,
    message: 'Faculties assigned successfully!',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const getFacultiesOfCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.getFacultiesOfCourseFromDB(courseId);
  sendResponse(res, {
    success: true,
    message: 'Faculties retrieved successfully!',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const removeFacultiesFromCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.removeFacultiesFromCourseFromDB(
    courseId,
    faculties,
  );
  sendResponse(res, {
    success: true,
    message: 'Faculties removed successfully!',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFacultiesWithCourse,
  getFacultiesOfCourse,
  removeFacultiesFromCourse,
};
