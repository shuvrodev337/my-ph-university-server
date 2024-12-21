import express from 'express';
import { AcademicFacultyController } from './academicFaculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academivFacultyValidation } from './academicFaculty.validation';
const router = express.Router();

router.post(
  '/create-academic-faculty',
  validateRequest(
    academivFacultyValidation.createAcademivFacultyValidationSchema,
  ),
  AcademicFacultyController.createAcademicFaculty,
);
router.get('/', AcademicFacultyController.getAcademicFaculties);
router.get(
  '/:academicFacultyId',
  AcademicFacultyController.getSingleAcademicFaculty,
);
router.patch(
  '/:academicFacultyId',
  validateRequest(
    academivFacultyValidation.updateAcademivFacultyValidationSchema,
  ),
  AcademicFacultyController.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
