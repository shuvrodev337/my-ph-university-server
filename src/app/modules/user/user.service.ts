import config from '../../config';
import { TStudent } from '../student/student.interface';
import { TNewUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  const userData: TNewUser = {};
  userData.password = password || config.default_pass;
  userData.role = 'student';
  userData.id = '203021234';

  // create user
  const result = await User.create(userData);

  // create student
  if (Object.keys(result).length) {
    studentData.id = result.id; // the embedded id from user document, which is set above(userData.id = '203021234';)
    studentData.user = result._id; // the objecid from user document
  }
  return result;
};
export const UserServices = {
  createStudentIntoDB,
};
