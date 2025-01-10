import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidation } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.admin),
  auth(USER_ROLE.admin),
  StudentControllers.getAllStudents,
);
router.get(
  '/:_id',
  auth(USER_ROLE.admin, USER_ROLE.faculty),

  StudentControllers.getSingleStudent,
);
router.patch(
  '/:_id',
  auth(USER_ROLE.admin),
  validateRequest(studentValidation.updateStudentValidationSchema),
  StudentControllers.updateSingleStudent,
);
router.delete(
  '/:_id',
  auth(USER_ROLE.admin),
  StudentControllers.deleteSingleStudent,
);

export const StudentRoutes = router;
