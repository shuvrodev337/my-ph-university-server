// ? { }  [] 0

import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EnrolledCourseServices } from './enrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const enrolledCourse = req.body;
  const result = await EnrolledCourseServices.createEnrolledCourseIntoDb(
    userId,
    enrolledCourse,
  );

  sendResponse(res, {
    success: true,
    message: 'Enrolled course created successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});

const getAllEnrolledCourses = catchAsync(async (req, res) => {
  const facultyId = req.user.userId;

  const result = await EnrolledCourseServices.getAllEnrolledCoursesFromDB(
    facultyId,
    req.query,
  );

  sendResponse(res, {
    sttatusCode: StatusCodes.OK,
    success: true,
    message: 'Enrolled courses are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getMyEnrolledCourses = catchAsync(async (req, res) => {
  const studentId = req.user.userId;

  const result = await EnrolledCourseServices.getMyEnrolledCoursesFromDB(
    studentId,
    req.query,
  );

  sendResponse(res, {
    sttatusCode: StatusCodes.OK,
    success: true,
    message: 'Enrolled courses are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const facultyId = req.user.userId;
  const enrolledCourseMarksData = req.body;
  const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDb(
    facultyId,
    enrolledCourseMarksData,
  );

  sendResponse(res, {
    success: true,
    message: 'Enrolled course marks updated successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
  getAllEnrolledCourses,
  getMyEnrolledCourses,
};
