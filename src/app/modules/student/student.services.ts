import mongoose from 'mongoose';
import { TStudent } from './student.interface';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { User } from '../user/user.model';

const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find()
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' }, // multiple layered populating
    })
    .populate('admissionSemester'); // double field populating with chaining
  return result;
  // populate is giving back the academicDepartment and admissionSemester full information instead of only refferenced objecId
};
const getSingleStudentFromDB = async (studentID: string) => {
  const result = await StudentModel.find({ id: studentID })
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    })
    .populate('admissionSemester');
  return result;
};
const updateSingleStudentFromDB = async (
  studentID: string,
  updateData: Partial<TStudent>,
) => {
  const result = await StudentModel.findOneAndUpdate(
    { id: studentID, isDeleted: { $ne: true } },
    { $set: updateData },
    { new: true }, //returns new modified document
  );

  return result;
};
const deleteSingleStudentFromDB = async (studentID: string) => {
  if (!(await StudentModel.doesUserExist(studentID))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find student!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const updatedStudent = await StudentModel.findOneAndUpdate(
      { id: studentID },
      { isDeleted: true },
      { new: true, session },
    );
    if (!updatedStudent) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete student!');
    }
    const updatedUser = await User.findOneAndUpdate(
      { id: studentID },
      { isDeleted: true },
      { new: true, session },
    );
    if (!updatedUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete user!');
    }

    session.commitTransaction();
    session.endSession();
    return updatedStudent;
  } catch (error) {
    session.abortTransaction();
    session.endSession();
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateSingleStudentFromDB,
  deleteSingleStudentFromDB,
};
