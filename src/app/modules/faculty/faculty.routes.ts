import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from './faculty.validation';
import { FacultyControllers } from './faculty.controller';
const router = express.Router();

router.get('/', FacultyControllers.getAllFaculties);
router.get('/:_id', FacultyControllers.getSingleFaculty);
router.patch(
  '/:_id',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);
router.delete('/:_id', FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
