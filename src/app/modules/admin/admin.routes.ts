import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AdminControllers } from './admin.controller';
import { adminValidations } from './admin.validation';
const router = express.Router();

router.get('/', AdminControllers.getAllAdmins);
router.get('/:adminID', AdminControllers.getSingleAdmin);
router.patch(
  '/:adminID',
  validateRequest(adminValidations.updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);
router.delete('/:adminID', AdminControllers.deleteAdmin);

export const AdminRoutes = router;
