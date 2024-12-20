import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterValidation } from './academicSemester.validation';
import { AcademicSemesterController } from './academicSemester.controller';

const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(
    academicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterController.createAcademicSemester,
);
router.get('/', AcademicSemesterController.getAcademicSemesters);
router.get(
  '/:semesterId',
  AcademicSemesterController.getSingleAcademicSemester,
);
router.patch('/:semesterId', AcademicSemesterController.updateAcademicSemester);

export const AcademicSemesterRoutes = router;
