import express from 'express';
import { EnrolledCourseControllers } from './enrolledCourse.controller';
const router = express.Router();

router.post(
  '/create-enrolled-course',
  EnrolledCourseControllers.createEnrolledCourse,
);

export const EnrolledCourseRoutes = router;
