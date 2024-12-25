import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { FacultySearchableFields } from './faculty.constant';
import { TFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';
import mongoose from 'mongoose';
import { User } from '../user/user.model';

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(Faculty.find(), query)
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;
  return result;
};

const getSingleFacultyFromDB = async (facultyId: string) => {
  const result = await Faculty.findOne({ id: facultyId });
  return result;
};
const updateFacultyIntoDB = async (
  facultyId: string,
  updateData: Partial<TFaculty>,
) => {
  const { name, ...remainingStudentData } = updateData;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findOneAndUpdate(
    { id: facultyId, isDeleted: { $ne: true } },
    modifiedUpdatedData,
    { new: true, runValidators: true },
  );

  return result;
};
const deleteFacultyFromDB = async (facultyId: string) => {
  if (!(await Faculty.isUserExists(facultyId))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find faculty!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const updatedfaculty = await Faculty.findOneAndUpdate(
      { id: facultyId },
      { isDeleted: true },
      { new: true, session },
    );
    if (!updatedfaculty) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete faulty!');
    }
    const updatedUser = await User.findOneAndUpdate(
      { id: facultyId },
      { isDeleted: true },
      { new: true, session },
    );
    if (!updatedUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete user!');
    }

    session.commitTransaction();
    session.endSession();
    return updatedfaculty;
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to delete student!',
    );
  }
};

export const StudentServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
};
