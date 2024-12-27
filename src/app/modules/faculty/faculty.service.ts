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

const getSingleFacultyFromDB = async (_id: string) => {
  const result = await Faculty.findById(_id);
  return result;
};
const updateFacultyIntoDB = async (
  _id: string,
  updateData: Partial<TFaculty>,
) => {
  if (!(await Faculty.isUserExists(_id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find faculty!');
  }
  const { name, ...remainingFacultyData } = updateData;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findByIdAndUpdate(
    { _id, isDeleted: { $ne: true } },
    modifiedUpdatedData,
    { new: true, runValidators: true },
  );

  return result;
};
const deleteFacultyFromDB = async (_id: string) => {
  if (!(await Faculty.isUserExists(_id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find faculty!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const updatedfaculty = await Faculty.findByIdAndUpdate(
      _id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!updatedfaculty) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete faulty!');
    }
    const user_id = updatedfaculty.user;
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!updatedUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete user!');
    }

    await session.commitTransaction();
    await session.endSession();
    return updatedfaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to delete faculty!',
    );
  }
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
};
