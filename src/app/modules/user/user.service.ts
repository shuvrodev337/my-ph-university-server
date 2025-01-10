import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TNewUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import mongoose from 'mongoose';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  const session = await mongoose.startSession(); //Transaction & Rollback- step 1- creating session
  try {
    session.startTransaction(); // Transaction & Rollback- step 2- start transaction
    const userData: TNewUser = {};
    userData.password = password || config.default_pass;
    userData.role = 'student';
    userData.email = studentData.email;

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
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create student!');
    }
    await session.commitTransaction(); // Transaction & Rollback- step 4- commit transaction(permanently writes data into DB)
    await session.endSession(); // Transaction & Rollback- step 5- end session
    return newStudent;
  } catch (error) {
    await session.abortTransaction(); // Transaction & Rollback- step 6- abort transaction if error occurs
    await session.endSession(); // Transaction & Rollback- step 7- end session if error occurs
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to create student!',
    );
  }
};

const createFacultyIntoDB = async (password: string, facultyData: TFaculty) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userData: TNewUser = {};
    userData.password = password || config.default_pass;
    userData.role = 'faculty';
    userData.email = facultyData.email;
    userData.id = await generateFacultyId();

    // create user
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user!');
    }
    facultyData.id = newUser[0].id;
    facultyData.user = newUser[0]._id;
    // create faculty
    const newFaculty = await Faculty.create([facultyData], { session });
    if (!newFaculty.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create faculty!');
    }
    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to create Faculty!',
    );
  }
};

const createAdminIntoDB = async (password: string, adminData: TAdmin) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userData: TNewUser = {};
    userData.password = password || config.default_pass;
    userData.role = 'admin';
    userData.email = adminData.email;

    userData.id = await generateAdminId();

    // create user
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user!');
    }
    adminData.id = newUser[0].id;
    adminData.user = newUser[0]._id;
    // create admin
    const newAdmin = await Admin.create([adminData], { session });
    if (!newAdmin.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create admin!');
    }
    await session.commitTransaction();
    await session.endSession();
    return newAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to create admin!',
    );
  }
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
};
