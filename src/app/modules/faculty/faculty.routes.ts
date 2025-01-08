import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from './faculty.validation';
import { FacultyControllers } from './faculty.controller';
import auth from '../../middlewares/auth';
const router = express.Router();

router.get('/', auth(), FacultyControllers.getAllFaculties);
router.get('/:_id', FacultyControllers.getSingleFaculty);
router.patch(
  '/:_id',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);
router.delete('/:_id', FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
