import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TNewUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // create user
  const userData: TNewUser = {};
  userData.password = password || config.default_pass;
  userData.role = 'student';

  // finding the admission semester, by the semester object id came from user.
  const admissionSemester = await AcademicSemester.findById(
    studentData.admissionSemester,
  );
  if (!admissionSemester) {
    throw new Error('No semester found!');
  }
  // generate formatted id for user
  userData.id = await generateStudentId(admissionSemester);
  const newUser = await User.create(userData);

  // create student
  if (Object.keys(newUser).length) {
    studentData.id = newUser.id; // this id is the embedded id from newUser
    studentData.user = newUser._id; // the objecid from newUser
    const newStudent = await StudentModel.create(studentData);
    return newStudent;
  }
};
export const UserServices = {
  createStudentIntoDB,
};
