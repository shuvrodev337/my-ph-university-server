import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AdminControllers } from './admin.controller';
import { adminValidations } from './admin.validation';
const router = express.Router();

router.get('/', AdminControllers.getAllAdmins);
router.get('/:_id', AdminControllers.getSingleAdmin);
router.patch(
  '/:_id',
  validateRequest(adminValidations.updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);
router.delete('/:_id', AdminControllers.deleteAdmin);

export const AdminRoutes = router;
