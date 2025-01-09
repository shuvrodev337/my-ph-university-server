import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from './faculty.validation';
import { FacultyControllers } from './faculty.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
const router = express.Router();

router.get('/', auth(USER_ROLE.admin), FacultyControllers.getAllFaculties);
router.get('/:_id', FacultyControllers.getSingleFaculty);
router.patch(
  '/:_id',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);
router.delete('/:_id', FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
