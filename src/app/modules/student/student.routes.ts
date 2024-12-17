import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

router.post('/create-student', StudentControllers.createStudent);
router.get('/', StudentControllers.getAllStudents);
router.get('/:studentID', StudentControllers.getSingleStudent);
router.put('/:studentID', StudentControllers.updateSingleStudent);
router.delete('/:studentID', StudentControllers.deleteSingleStudent);

export const StudentRoutes = router;
