import config from '../../config';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TNewUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // create user
  const userData: TNewUser = {};
  userData.password = password || config.default_pass;
  userData.role = 'student';
  userData.id = '203021234'; //This is set  temporarily , later will be embedded
  const newUser = await User.create(userData);

  // create student
  if (Object.keys(newUser).length) {
    studentData.id = newUser.id; // this id is the embedded id from user document(userData.id = '203021234';)
    studentData.user = newUser._id; // the objecid from user document
    const newStudent = await StudentModel.create(studentData);
    return newStudent;
  }
};
export const UserServices = {
  createStudentIntoDB,
};
