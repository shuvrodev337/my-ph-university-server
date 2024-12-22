import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TNewUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import mongoose from 'mongoose';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  const session = await mongoose.startSession(); //Transaction & Rollback- step 1- creating session
  try {
    session.startTransaction(); // Transaction & Rollback- step 2- start transaction
    const userData: TNewUser = {};
    userData.password = password || config.default_pass;
    userData.role = 'student';

    // finding the admission semester, by the semester object id came from user.
    const admissionSemester = await AcademicSemester.findById(
      studentData.admissionSemester,
    );
    if (!admissionSemester) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Invalid semester code!');
    }
    // generate formatted id for user
    userData.id = await generateStudentId(admissionSemester);

    // create user
    const newUser = await User.create([userData], { session }); // Transaction & Rollback- step 3- use session //returns array
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user!');
    }
    studentData.id = newUser[0].id;
    studentData.user = newUser[0]._id;
    // create student
    const newStudent = await StudentModel.create([studentData], { session }); // Transaction & Rollback- step 3- use session //returns array
    if (!newStudent.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user!');
    }
    await session.commitTransaction(); // Transaction & Rollback- step 4- commit transaction(permanently writes data into DB)
    await session.endSession(); // Transaction & Rollback- step 5- end session
    return newStudent;
  } catch (error) {
    await session.abortTransaction(); // Transaction & Rollback- step 6- abort transaction if error occurs
    await session.endSession(); // Transaction & Rollback- step 7- end session if error occurs
  }
};
export const UserServices = {
  createStudentIntoDB,
};
