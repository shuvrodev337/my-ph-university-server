import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidation } from './student.validation';

const router = express.Router();

router.get('/', StudentControllers.getAllStudents);
router.get('/:_id', StudentControllers.getSingleStudent);
router.patch(
  '/:_id',
  validateRequest(studentValidation.updateStudentValidationSchema),
  StudentControllers.updateSingleStudent,
);
router.delete('/:_id', StudentControllers.deleteSingleStudent);

export const StudentRoutes = router;
