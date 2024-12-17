import express from 'express';
import { StudentRoutes } from '../modules/student/student.routes';
import { UserRoutes } from '../modules/user/user.routes';
const router = express.Router();

const modeuleRoutes = [
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
];
modeuleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
