import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from './faculty.validation';
import { FacultyControllers } from './faculty.controller';
const router = express.Router();

router.get('/', FacultyControllers.getAllFaculties);
router.get('/:facultyID', FacultyControllers.getSingleFaculty);
router.patch(
  '/:facultyID',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateSingleFaculty,
);
router.delete('/:facultyID', FacultyControllers.deleteSingleFaculty);

export const FacultyRoutes = router;
