import config from '../config';
import { USER_ROLE } from '../modules/user/user.constant';
import { TUser } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const superAdmin: TUser = {
  id: '0001',
  email: 'shuvrodevmondal337@gmail.com',
  password: config.super_admin_password as string,
  role: USER_ROLE.superAdmin,
  needsPasswordChange: false,
  status: 'in-progress',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  // when database gets connected, we will check , is there any user who is super admin
  const isSuperAdminExits = await User.findOne({ role: USER_ROLE.superAdmin });

  if (!isSuperAdminExits) {
    await User.create(superAdmin);
  }
};

export default seedSuperAdmin;
