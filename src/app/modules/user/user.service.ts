/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';

const createStudentIntoDB = async (
  file: any,
  password: string,
  studentData: TStudent,
) => {
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
    // finding the academicDepartment
    const academicDepartment = await AcademicDepartment.findById(
      studentData.academicDepartment,
    );
    if (!academicDepartment) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Academic Department not found!',
      );
    }

    // generate formatted id for user
    userData.id = await generateStudentId(admissionSemester);

    // uploading image functionality and set profileImg of Student
    if (file) {
      const imageName = `${userData.id}${studentData?.name?.firstName}`; // generate custom name
      const path = file?.path; // folder path where the file is saved temporarily.

      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);

      studentData.profileImg = secure_url as string; // set the secure_url from cloudinaryData as profileImg of student
    }

    // create user
    const newUser = await User.create([userData], { session }); // Transaction & Rollback- step 3- use session //returns array
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user!');
    }
    //set id and user refference field of studentData
    studentData.id = newUser[0].id;
    studentData.user = newUser[0]._id;
    // set academicFaculty
    studentData.academicFaculty = academicDepartment.academicFaculty;

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

const createFacultyIntoDB = async (
  file: any,
  password: string,
  facultyData: TFaculty,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userData: TNewUser = {};
    userData.password = password || config.default_pass;
    userData.role = 'faculty';
    userData.email = facultyData.email;
    userData.id = await generateFacultyId();
    // finding the academicDepartment
    const academicDepartment = await AcademicDepartment.findById(
      facultyData.academicDepartment,
    );
    if (!academicDepartment) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Academic Department not found!',
      );
    }

    // uploading image functionality and set profileImg of Faculty
    if (file) {
      const imageName = `${userData.id}${facultyData?.name?.firstName}`; // generate custom name
      const path = file?.path; // folder path where the file is saved temporarily.

      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);

      facultyData.profileImg = secure_url as string; // set the secure_url from cloudinaryData as profileImg of faculty
    }

    // create user
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user!');
    }
    facultyData.id = newUser[0].id;
    facultyData.user = newUser[0]._id;
    // set academicFaculty
    facultyData.academicFaculty = academicDepartment.academicFaculty;
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

const createAdminIntoDB = async (
  file: any,
  password: string,
  adminData: TAdmin,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userData: TNewUser = {};
    userData.password = password || config.default_pass;
    userData.role = 'admin';
    userData.email = adminData.email;

    userData.id = await generateAdminId();

    // uploading image functionality and set profileImg of Admin

    if (file) {
      const imageName = `${userData.id}${adminData?.name?.firstName}`; // generate custom name
      const path = file?.path; // folder path where the file is saved temporarily.

      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);

      adminData.profileImg = secure_url as string; // set the secure_url from cloudinaryData as profileImg of Admin
    }

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
const getMe = async (userId: string, role: string) => {
  // to prevent a student to get another studen,or a faculty to get another faculty data.
  // we create this service to get the user his own data not other's data

  let result = null;

  if (role === 'student') {
    result = await StudentModel.findOne({ id: userId })
      .populate({
        path: 'academicDepartment',
        populate: { path: 'academicFaculty' }, // nested populating
      })
      .populate('admissionSemester');
  }
  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }
  return result;
};
const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  changeStatus,
};
