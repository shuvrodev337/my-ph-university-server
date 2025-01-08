import express from 'express';
import { AuthControllers } from './auth.controller';
import { authValidations } from './auth.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidations.loginValidationSchema),
  AuthControllers.loginUser,
);
router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  validateRequest(authValidations.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

export const AuthRoutes = router;
