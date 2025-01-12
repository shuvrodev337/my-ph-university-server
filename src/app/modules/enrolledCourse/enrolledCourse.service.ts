// ? { }  [] 0

import { TEnrolledCourse } from './enrolledCourse.interface';

const createEnrolledCourseIntoDb = async (payload: TEnrolledCourse) => {
  console.log(payload);
};

export const EnrolledCourseServices = { createEnrolledCourseIntoDb };
