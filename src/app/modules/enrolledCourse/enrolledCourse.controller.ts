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

export const EnrolledCourseControllers = { createEnrolledCourse };
