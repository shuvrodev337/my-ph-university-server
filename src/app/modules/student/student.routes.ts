import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidation } from './student.validation';

const router = express.Router();

router.get('/', StudentControllers.getAllStudents);
router.get('/:studentID', StudentControllers.getSingleStudent);
router.patch(
  '/:studentID',
  validateRequest(studentValidation.updateStudentValidationSchema),
  StudentControllers.updateSingleStudent,
);
router.delete('/:studentID', StudentControllers.deleteSingleStudent);

export const StudentRoutes = router;
