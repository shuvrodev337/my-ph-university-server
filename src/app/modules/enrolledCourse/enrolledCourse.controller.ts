// ? { }  [] 0

import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EnrolledCourseServices } from './enrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const enrolledCourse = req.body;
  // console.log(query);
  const result =
    await EnrolledCourseServices.createEnrolledCourseIntoDb(enrolledCourse);

  sendResponse(res, {
    success: true,
    message: 'Enrolled course created successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});

export const EnrolledCourseControllers = { createEnrolledCourse };
